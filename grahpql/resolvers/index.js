const userResolvers = require('./user');
const nftResolvers = require('./nft');
const tournamentResolvers = require('./tournament')


module.exports = {

    Query: {
        ...nftResolvers.Query,
        ...userResolvers.Query,
        // ...tournamentResolvers.Query,
    },

    Mutation:{
        ...userResolvers.Mutation,
        ...nftResolvers.Mutation,
        ...tournamentResolvers.Mutation,
    }

}