const Tournament = require("../../models/Tournament");
const Fight = require("../../models/Fight");
const checkAuth = require("../../middleware/checkAuth");
const { AuthenticationError } = require("apollo-server");
const { generateFightResults } = require("../../helpers/fightReplayGenerator");

// helper function that just randomly chooses the order of two nfts in an array. 
const getWinnerAndLoser = function (nft1, nft2) {
    return Math.random() < 0.5 ? [nft1, nft2] : [nft2, nft1];
};

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

// create tournament, 3 fights, and their respective 
const createTournament = async function (tournamentDetails) {
    try {
        const tournament = await new Tournament({ ...tournamentDetails });
        const fightsArray = [];

        //TODO: make a helper function that gives the right tier for 32 nfts
        //create first 3 fights
        for (let tournamentIndex = 0; tournamentIndex < 3; tournamentIndex++) {  //TODO: change the 3 to 31
            const tier = tournamentIndex < 2 ? 1 : 2; //TODO: change this to a loop that gives the appropriate tier. 

            const generateFight = await createFight({
                fightReplay: [],
                nfts: [],
                tournamentIndex,
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
                const result = await Tournament.findById(tournamentId);
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
                        tournamentIndex: i,
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

        async resolveTournament(_, { tournamentId }) { //TODO: look for refactoring here
            try {
                const tournament = await Tournament.findById(tournamentId).populate("fights");

                if(tournament.status !== 'ready') {
                    throw new Error("Tournament is not ready.");
                }
                
                for ( let index = 0; index < tournament.fights.length; index++ ) {
                    // Determine winner, loser & populate the fightReplay field
                    const fight = await tournament.fights[index].populate("nfts");

                    [fight.winnerId, fight.loserId] = getWinnerAndLoser(fight.nfts[0].id, fight.nfts[1].id);

                    let fightReplay = getFightReplay(fight.nfts[0].id, fight.nfts[1].id, fight.winnerId);
                    fight.fightReplay.push(...fightReplay);
                    
                    await fight.save();


                    // Insert fight into the first availible slot on next tier
                    if (index !== tournament.fights.length - 1) {
                        // finds the first fight in next tier that has an empty slot.
                        const nextFight = await tournament.fights.find((fight) => {
                            return (
                                fight.tier === fight.tier + 1 &&
                                fight.nfts.length !== 2
                            );
                        });
                                
                        nextFight.nfts.push(fight.winnerId);
                        await nextFight.save();
                    } else {
                        //If last fight update the tournament winnerId and runnerupId & Update Tournament to completed.
                        tournament.winner = fight.winnerId;
                        tournament.runnerUp = fight.loserId;
                        tournament.status = "completed";

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