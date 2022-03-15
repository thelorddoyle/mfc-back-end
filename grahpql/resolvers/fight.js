const Tournament = require('../../models/Tournament')
const Fight = require('../../models/Fight');
const User = require('../../models/User');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports =  {

    Query: {
    
        async getFights() {
            try {
                const result = await Fight.find();
                return result
            } catch (error) {
                throw new Error(error);
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
        async createFight(_, {createFight}, context){
            
            try{
              const fight = await new Fight({...createFight, winner: createFight.winnerId, loser: createFight.loserId})

              await fight.save();
              console.log(await fight.populate('winner loser'));
              
              return fight;
            } catch(err){
              throw new Error(err);
            }
          },
        },

}