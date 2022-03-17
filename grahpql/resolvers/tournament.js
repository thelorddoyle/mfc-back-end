const Tournament = require('../../models/Tournament')
const Fight = require('../../models/Fight')
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');
const {generateFightResults} = require('../../helpers/fightReplayGenerator')

// helper function that just randomly chooses between 2 nfts as to who wins
const getWinner = function (nft1, nft2) {
    if (Math.random() < 5) {
        return nft1
    } else {
        return nft2
    }
}

// 
const getFightReplay = function (nft1, nft2, winner) {

    try{
        const fightReplay = generateFightResults(nft1, nft2, winner)
        return fightReplay
    } catch (err) {
        throw new Error(err)
    }
}

const createFight = async function (createFight){
    try{
        const fight = await new Fight({...createFight})
        await fight.save();
        return fight;
    } catch(err){
        throw new Error(err);
    }
};

const getCurrentTournament = async function() {
    try {
        const result =  await Tournament.findOne({status: "pending"});
        if (result){
            return result
        }else{
            throw new Error('Tournament not found')
        }
        
    } catch (error) {
        throw new Error('Tournament not found')
    }
}

const createTournament = async  function(createTournament){
    try{
        //Create tournament object
        const tournament = await new Tournament({...createTournament})
        const fightsArray = [];

        //We create the first two empty fights
        for (let i = 0; i < 3; i++) {
            const tier = i < 2 ? 1 : 2;
            //TODO: make a helper function that gives the right tier for 32 nfts

            const generateFight = await createFight({
                fightReplay: [],
                tournamentIndex: i,
                nfts: [],
                tier
            })
        fightsArray.push(generateFight._id)
        }

        tournament.fights.push(...fightsArray);
        await tournament.save();

        return tournament;
    } catch(err){
        throw new Error(err);
    }
};

module.exports =  {
    createTournament,
    getCurrentTournament,
    Query: {
    
        async getTournaments() {
            try {
                const result = await Tournament.find();
                return result
            } catch (error) {
                throw new Error(error);
            }
        },


        async getCurrentTournament(){
            return getCurrentTournament(); 
        },

        async getTournament(_,{tournamentId}) {

            try {
                const result =  await Tournament.findById(tournamentId);
                if (result){
                    return result
                }else{
                    throw new Error('Tournament not found')
                }
                
            } catch (error) {
                throw new Error('Tournament not found')
            }
        },

    },

    Mutation: {

        async createTournament (_, {createTournament}, context){
            try{
                //Create tournament object
                const tournament = await new Tournament({...createTournament})
                const fightsArray = [];

                //We create the first three empty fights
                for (let i = 0; i < 3; i++) {
                    const generateFight = await createFight({
                        fightReplay: [],
                        tournamentIndex: i,
                        nfts: []
                    })
                    fightsArray.push(generateFight._id)
                }

                tournament.fights.push(...fightsArray);
                await tournament.save();

                return tournament;
            } catch(err){
                throw new Error(err);
            }
          },
        
          async updateTournament(_, {tournament}){
            try {
                const {id} = tournament
                const currentTournament = await Tournament.findById(id);
                //TODO: put in validation later. (EMAIL)
                
                Object.assign(currentTournament, tournament);
                currentTournament.save();
                return currentTournament;
            } catch (error) {
                throw new Error('error');
            }
        },

        async resolveTournament(_, {tournamentId}) {
            try {
                const currentTournament = await Tournament.findById(tournamentId).populate('fights');

                if (currentTournament.status === 'ready') {

                    for (let index = 0; index < currentTournament.fights.length - 1; index++) {

                        const fight = await currentTournament.fights[index].populate('nfts');
                        const firstNftId = fight.nfts[0].id;
                        const secondNftId = fight.nfts[1].id;
                        fight.winnerId = getWinner(firstNftId, secondNftId);
                        fight.loserId = fight.winnerId === firstNftId ? secondNftId : firstNftId;

                        let fightReplay = getFightReplay(firstNftId, secondNftId, fight.winnerId);
                        fight.fightReplay.push(...fightReplay);
                        
                        await fight.save();
                        // TODO: send winner to next fight then resolve.

                        // find the next availible fight in next tournament tier. 
                        const nextTier = fight.tier + 1
                        
                        // finds the first fight in next tier that has an empty slot. 
                        const nextFight = await currentTournament.fights.find( fight => {
                            return fight.tier = nextTier && fight.nfts.length !== 2
                        });
                        

                        console.log('tier:', fight.tier);
                        console.log('next fight:', nextFight);
                        nextFight.nfts.push(fight.winnerId);

                        await nextFight.save();

                    }
                    return currentTournament
                } else {
                    throw new Error('Tournament is not ready.')
                }

            } catch (err) {
                throw new Error(err)
            }
        }
    },

}