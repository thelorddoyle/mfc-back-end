const userResolvers = require("./user");
const nftResolvers = require("./nft");
const tournamentResolvers = require("./tournament");
const fightResolvers = require("./fight");

module.exports = {
    Query: {
        ...nftResolvers.Query,
        ...userResolvers.Query,
        ...tournamentResolvers.Query,
        ...fightResolvers.Query,
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...nftResolvers.Mutation,
        ...tournamentResolvers.Mutation,
        ...fightResolvers.Mutation,
    },
};
