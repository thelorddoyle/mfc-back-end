const Tournament = require("../../models/Tournament");
const Fight = require("../../models/Fight");
const checkAuth = require("../../middleware/checkAuth");
const { AuthenticationError } = require("apollo-server");
const { generateFightResults } = require("../../helpers/fightReplayGenerator");
const { addAmount } = require("../resolvers/user");
const Nft = require("../../models/Nft");

// helper function that just randomly chooses the order of two nfts in an array. 
const getWinnerAndLoser = function (nft1, nft2) {
    return Math.random() < 0.5 ? [nft1, nft2] : [nft2, nft1];
};

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

// gets an array of objs that contain the move, the attacker and defender. 
const getFightReplay = function (nft1, nft2, winner) {
    try {
        const fightReplay = generateFightResults(nft1, nft2, winner);
        return fightReplay;
    } catch (err) {
        throw new Error(err);
    }
};

const createFight = async function (fightDetails) {
    try {
        const fight = await new Fight({ ...fightDetails });
        await fight.save();
        return fight;
    } catch (err) {
        throw new Error(err);
    }
};

// get first tournament with a status: 'pending'
const getCurrentTournament = async function () { //TODO: possibly remove the try catch
    try {
        const result = await Tournament.findOne({ status: "pending" });
        if (result) {
            return result;
        } else {
            throw new Error("No 'pending' tournament found");
        }
    } catch (error) {
        throw new Error("Tournament not found");
    }
};

// inputing 0-15 gives 1, 16-23 gives 2, 24-27 gives 3....
const getTier = (fightIndex) => {
    if (fightIndex < 16){
        return 1;
    } else if(fightIndex < 24){
        return 2;
    } else if(fightIndex < 28){
        return 3;
    } else if(fightIndex < 30){
        return 4;
    } else if(fightIndex < 31){
        return 5;
    }
}

// create tournament, 3 fights, and their respective 
const createTournament = async function (tournamentDetails) {
    try {
        const tournament = await new Tournament({ ...tournamentDetails });
        const fightsArray = [];

        //create first 3 fights
        for (let fightIndex = 0; fightIndex < 31; fightIndex++) {  // fightIndex is the fight index in the tournament ranges from 0-31

            const tier = getTier(fightIndex);
            
            const generateFight = await createFight({
                fightReplay: [],
                nfts: [],
                tournament: tournament.id,
                fightIndex,
                tier,
            });

            fightsArray.push(generateFight._id);
        }

        tournament.fights.push(...fightsArray);
        await tournament.save();

        return tournament;
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    createTournament,
    getCurrentTournament,
    getWinnerAndLoser,
    getTier,
    addFightToNft,
    addNftToFight,
    Query: {
        async getTournaments() {
            try {
                const result = await Tournament.find();
                return result;
            } catch (error) {
                throw new Error(error);
            }
        },

        async getCurrentTournament() {
            return getCurrentTournament();
        },

        async getTournament(_, { tournamentId }) {
            try {
                const result = await Tournament.findById(tournamentId).populate({
                    path: 'fights',
                    populate: {path: 'nfts'}
                });
                if (result) {
                    return result;
                } else {
                    throw new Error("Tournament not found");
                }
            } catch (error) {
                throw new Error("Tournament not found");
            }
        },
    },

    Mutation: {
        async createTournament(_, { tournamentDetails }, context) {
            try {
                //Create tournament object
                const tournament = await new Tournament({
                    ...tournamentDetails,
                });
                const fightsArray = [];

                //We create the first three empty fights
                for (let i = 0; i < 3; i++) {
                    const generateFight = await createFight({
                        fightReplay: [],
                        fightIndex: i,
                        nfts: [],
                    });
                    fightsArray.push(generateFight._id);
                }

                tournament.fights.push(...fightsArray);
                await tournament.save();

                return tournament;
            } catch (err) {
                throw new Error(err);
            }
        },

        async updateTournament(_, { tournament }) {
            try {
                const { id } = tournament;
                const currentTournament = await Tournament.findById(id);

                Object.assign(currentTournament, tournament);
                currentTournament.save();
                return currentTournament;
            } catch (error) {
                throw new Error("error");
            }
        },


        async resolveTournament(_, { tournamentId }) {
            try {
                // find tournament
                const tournament = await Tournament.findById(tournamentId).populate("fights");

                if(tournament.status !== 'ready') {
                    throw new Error("Tournament is not ready.");
                }
                
                // Loop over fights, determine winner, loser & populate the fightReplay field
                for ( let i = 0; i < tournament.fights.length; i++ ) {
                    const fight = await tournament.fights[i].populate("nfts");

                    [fight.winnerId, fight.loserId] = getWinnerAndLoser(fight.nfts[0].id, fight.nfts[1].id);
                    let fightReplay = getFightReplay(fight.nfts[0].id, fight.nfts[1].id, fight.winnerId);
                    fight.fightReplay.push(...fightReplay);
                    
                    await fight.save();

                    
                    // Insert fight into the first availible slot on next tier
                    if (i !== tournament.fights.length - 1) {
                        const nextTier = fight.tier + 1;

                        // finds the first fight in next tier that has an empty slot.
                        const nextFight = await tournament.fights.find((f) => {
                            return (
                                f.tier === nextTier &&
                                f.nfts.length < 2
                            );
                        });
                        
                        const nft = await Nft.findById(fight.winnerId);
                        await addFightToNft(nextFight, nft);
                        await addNftToFight(nft, nextFight);
                        
                    } else {
                        //If last fight update the tournament winnerId and runnerupId & Update Tournament to completed.
                        tournament.winner = fight.winnerId;
                        tournament.runnerUp = fight.loserId;
                        tournament.status = "completed";

                        //TODO: Find the two user accounts the NFT belongs to. 
                        await tournament.populate('winner');
                        tournament.populate('runnerUp');

                        await addAmount(tournament.winner.id, 0.75);
                        await addAmount(tournament.runnerUp.id, 0.25);

                        await tournament.save();
                    }
                }
                return tournament;

            } catch (err) {
                throw new Error(err);
            }
        },
    },
};