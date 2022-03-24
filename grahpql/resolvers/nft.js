//RESOLVERS
const { AuthenticationError } = require("apollo-server");
const { UserInputError } = require("apollo-server");
//For each query or mutuation there is a resolver, which processes any sort of logic
const { getCurrentTournament } = require("./tournament");
const { removeAmount } = require('./user');
const Nft = require("../../models/Nft");
const Tournament = require("../../models/Tournament");
const checkAuth = require("../../middleware/checkAuth");
const { validateRemoveAmount } = require("../../helpers/validators");
const tournament = require("./tournament");

// if tournament tier 1 fights completely filled, then change status to ready
const isFinalFightFilled = (fights) => {
    return fights[15].nfts.length === 2
}

// returns a function that is modified for the round input. 
const findIfEmptySlotAvailible = (round) => {
    if (round === 1){ // any slot can be taken in round 1
        console.log(round)
        return (slotsOccupied) => {
            return slotsOccupied < 2
        }
    } else { // only slot in index 1 slot can be taken in round 1
        return (slotsOccupied) => {
            return slotsOccupied === 1; 
        }
    }
}

const insertFirstFight = async (tournament, nftId) => {
    const round = tournament.round;
    const fights = tournament.fights;
    
    // generates a callback function that decides if nft can take fight slot. 
    let isEmptySlot = findIfEmptySlotAvailible(round);

    // Loop over all fights and if empty slot found, then add nft and break

    // find first empty slot.
    
    for (let i = 0; i < fights.length; i++) {
        const slotsOccupied = fights[i].nfts.length;
        
        if (isEmptySlot(slotsOccupied)) { // checks if there is an empty slot depending on round. 
            addFightToNft(fights[i].id, nftId);
            fights[i].nfts.push(nftId);
            await fights[i].save();

            if (isFinalFightFilled(fights)){
                tournament.status = "ready";
                await tournament.save();
            }

            break;
        }
    }
};



const putNftIntoAvailibleFights = async function (nftId) {
    try {
        const tournament = await getCurrentTournament(); // get the first "status: pending" tournament
        await tournament.populate("fights");

        let roundNumberTracker = tournament.round + 1;
        await insertFirstFight(tournament, nftId);

        const remainingRounds = 3 - tournament.round;
        for (i = 0; i < remainingRounds; i++) {
            let allTournamentsInRound = await Tournament.find({
                round: roundNumberTracker,
            }).populate("fights");

            // the break below will bubble up to here.
            breakingLoops: for (let j = 0; j < allTournamentsInRound.length; j++) {
                const fights = allTournamentsInRound[j].fights;

                // loop over all fights and find the first one with an empty slot
                for (let k = 0; k < fights.length; k++) {
                    const length = fights[k].nfts.length;
                    if (length === 0 && fights[k].fightIndex < 16) { // this number cannot be hard
                        fights[k].nfts.push(nftId); // TODO: for each of the nfts we also assign their fights field with the id. 
                        
                        addFightToNft(fights[k].id, nftId);

                        await fights[k].save();
                        break breakingLoops;
                    }
                }
            }

            //TODO: figure out why this needs a conditional?
            if (roundNumberTracker < 10) {
                roundNumberTracker++;
            }
        }

        const tournaments = await getCurrentTournament();
        await tournaments.populate("fights");
    } catch (error) {
        throw new UserInputError(error);
    }
};

const addFightToNft = async (fightId, nftId) => {
    const nft = await Nft.findById(nftId).populate('fights');
    
    nft.fights.push(fightId);
    await nft.save();
}

const mintNft = async (userId) => {
    try {
        const nftCost = 0.1;

        removeAmount(userId, nftCost);//TODO: remove the funds from account 

        const nft = await Nft.findOne({ user: { $exists: false } });
        if (nft) {
            nft.user = userId; // this saves a reference to the User with the 'userId'
            await nft.save();
            await nft.populate("user"); // adds the user reference obj
            await putNftIntoAvailibleFights(nft.id);
            
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
