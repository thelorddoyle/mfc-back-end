const { AuthenticationError } = require("apollo-server");
const { UserInputError } = require("apollo-server");

const checkAuth = require("../../middleware/checkAuth");
const { validateRemoveAmount } = require("../../helpers/validators");
const { getCurrentTournament } = require("./tournament");
const { removeAmount } = require('./user');
const Nft = require("../../models/Nft");
const Fight = require("../../models/Fight");
const Tournament = require("../../models/Tournament");
const tournament = require("./tournament");

// if tournament tier 1 fights completely filled, then change status to ready
const isFinalFightFilled = (fights) => {
    return fights[15].nfts.length === 2
}

// returns a function that is modified for the round input. 
const findIfEmptySlotAvailible = (round) => {
    if (round === 1){ // any slot can be taken in round 1
        return (slotsOccupied) => {
            return slotsOccupied < 2
        }
    } else { // only slot in index 1 slot can be taken in round 1
        return (slotsOccupied) => {
            return slotsOccupied === 1; 
        }
    }
}

const addFightToNft = async (fight, nft) => {
    try {
    
        nft.fights.push(fight.id);
        await nft.save();
    } catch (error) {
        console.log(error);
    }
}

const addNftToFight = async (nft, fight) => {
    try {
        fight.nfts.push(nft.id);
        await fight.save();
    } catch (error) {
        console.log(error);
    }
}

const insertIntoFirstFight = async (tournament, nft) => {
    // generates a callback function that decides if nft can take fight slot. 
    const isEmptySlot = findIfEmptySlotAvailible(tournament.round);

    //find first fight with open slot
    const fightWithSlot = tournament.fights.find(fight => isEmptySlot(fight.nfts.length));
    
    // if fight exists add nft to fight and fight to nft
    if (fightWithSlot){
        addFightToNft(fightWithSlot, nft);
        fightWithSlot.nfts.push(nft);
        fightWithSlot.save();
    
        // update tournament status if ready
        if (isFinalFightFilled(tournament.fights)){
            tournament.status = "ready";
            await tournament.save();
        }
    }
}

const findEmptyFight = (roundTournaments) => {
    
    let emptyFight;
    let i = 0; 

    while(!emptyFight && i < roundTournaments.length){
    
        emptyFight = roundTournaments[i].fights.find(fight => {
            return fight.fightIndex < 16 && fight.nfts.length === 0;
        })
        i++;
    }

    return emptyFight;

}

const putNftIntoAvailibleFights = async function (nft) {
    try {
        const tournament = await getCurrentTournament();
        await tournament.populate("fights");
        let round = tournament.round + 1;
        const totalNumRounds = 3; //TODO: change the '3' here to however many rounds are intended. 

        await insertIntoFirstFight(tournament, nft);

        // for every elligible round insert nft into first availible slot
        for (round; round <= totalNumRounds; round++) {
            let roundTournaments = await Tournament.find({ round }).populate("fights");
            const fight = findEmptyFight(roundTournaments);

            await addFightToNft(fight, nft);
            await addNftToFight(nft, fight);
        }
    } catch (error) {
        throw new UserInputError(error);
    }
};

const mintNft = async (userId) => {
    try {
        const nftCost = 0.1;
        const nft = await Nft.findOne({ user: { $exists: false } });

        removeAmount(userId, nftCost); //TODO: verify that this is a good handling. 

        if (nft) {
            nft.user = userId;
            await nft.save();
            await nft.populate("user"); // adds the user reference obj
            await putNftIntoAvailibleFights(nft);
            
            return nft;
        } else {
            throw new UserInputError("We are out of NFTs");
        }
    } catch (err) {
        throw new UserInputError(err);
    }
}

module.exports = {
    mintNft,
    isFinalFightFilled,
    findIfEmptySlotAvailible,
    findEmptyFight,
    putNftIntoAvailibleFights,
    addFightToNft,
    addNftToFight,
    Query: {
        async getNfts() {
            try {
                const result = await Nft.find();
                return result;
            } catch (error) {
                throw new Error(error);
            }
        },

        async getNft(_, { nftID }) {
            try {
                const result = await Nft.findById(nftID).populate({
                    path: 'fights',
                    populate: {path: 'tournament'}
                });
                
                if (result) {
                    return result;
                } else {
                    throw new Error("Nft not found");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        async getNftFights (_, { nftID }) {
            try {
                const result = await Nft.findById(nftID).populate('fights');
                console.log()
                if (result) {
                    return result;
                } else {
                    throw new Error("Nft not found");
                }
            } catch (error) {
                throw new Error("Nft not found");
            }
        }
    },

    Mutation: {
        async createNft(_, { nftDetails }, context) {
            try {
                const nft = await Nft({ ...nftDetails });
                await nft.save();

                return nft;
            } catch (err) {
                throw new Error(err);
            }
        },

        // Assigns NFT UserId & enters them into one pending tournaments in each round.
        async mintNft(_, __, context) {
            // TODO: perform a check to see if funds available.
            const { id } = checkAuth(context);

            return await mintNft(id);
        },
    },
};