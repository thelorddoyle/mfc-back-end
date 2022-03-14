const userResolvers = require('./user');
const nftResolvers = require('./nft');


module.exports = {

    Query: {
        ...nftResolvers.Query,
        ...userResolvers.Query,
    },

    Mutation:{
        ...userResolvers.Mutation,
        ...nftResolvers.Mutation,
    }

}