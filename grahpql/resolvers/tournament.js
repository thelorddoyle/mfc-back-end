const Tournament = require('../../models/Tournament')
const Fight = require('../../models/Fight')
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');



const  createFight = async function (createFight){
    try{
      const fight = await new Fight({...createFight})
      await fight.save();
      console.log(fight);
      return fight;
    } catch(err){
      throw new Error(err);
    }
  };

module.exports =  {
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

        async createTournament(_, {createTournament}, context){
            try{
                //Create tournament object
                const tournament = await new Tournament({...createTournament})
                const fightsArray = [];

                //We create the first two empty fights
                for (let i = 0; i < 3; i++) {
                    const generateFight = await createFight({
                        fightReplay: [],
                        tournamentIndex: i,
                        nfts: []
                    })
                    console.log('generateFight result from calling the fucntion', generateFight);
                    fightsArray.push(generateFight._id)
                }

                console.log('fights Arrays lozza kiss yummi', fightsArray)
                //We include the new 2 fights in the created tournament

                tournament.fights.push(...fightsArray);
                console.log("tournament before saving it", tournament);
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
    

    },

}