const Tournament = require('../../models/Tournament')
const Nft = require('../../models/Nft');
const User = require('../../models/User');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports =  {

    Query: {
        

    },

    Mutation: {

        async createTournament(_, {createTournament}, context){

            console.log('hello')

            console.log(createTournament)

            try{
              const tournament = await Tournament({...createTournament})
              await tournament.save();
              return tournament;
            } catch(err){
              throw new Error(err);
            }
          },
    

    },

}