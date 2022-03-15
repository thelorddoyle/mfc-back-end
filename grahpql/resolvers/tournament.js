const Tournament = require('../../models/Tournament')
const Nft = require('../../models/Nft');
const User = require('../../models/User');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');


// const generateFights = function(torunament){
//     console.log(toruname)
// }


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
                console.log(result);
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
              const tournament = await Tournament({...createTournament})
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