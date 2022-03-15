//RESOLVERS
//For each query or mutuation there is a resolver, which processes any sort of logic 
const Nft = require('../../models/Nft');
const User = require('../../models/User');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');
const { getCurrentTournament } = require('./tournament');


module.exports =  {

    Query: {
        
        async getNfts() {
            try {
                const result = await Nft.find();
                return result
            } catch (error) {
                throw new Error(error);
            }
        },

        async getNft(_,{nftID}) {
            try {
                const result =  await Nft.findById(nftID);
                if (result){
                    return result
                }else{
                    throw new Error('Nft not found')
                }
                
            } catch (error) {
                throw new Error('Nft not found')
            }
        },

    },

    Mutation: {
        async createNft(_, {createNft}, context){
          try{
            const nft = await Nft({...createNft})
            await nft.save();

            return nft;
          } catch(err){
            throw new Error(err);
          }
        },
        
        async mintNft(_, {userId}, context){
          try{
            const nft = await Nft.findOne({user: { $exists: false }});
            console.log(nft)
            nft.user = userId;
            await nft.save();

            // we need to find the first tournament AND then add the nft to the first availble fight. 

            // IN NFT MAKE METHOD THAT GETS TOURNAMENT(not full) ==> FIGHT (not full) ==> ADD THE NFT 
            // const tournament = getCurrentTournament();
            debugger;
            // console.log('tournament', tournament);

            return nft;
          } catch(err){
            throw new Error(err);
          }
        },
    },

}