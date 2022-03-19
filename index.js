const { ApolloServer } = require("apollo-server");
const db = require("./config/db");
const resolvers = require("./grahpql/resolvers/index");
const userDefs = require("./grahpql/typeDef/user");
const nftDefs = require("./grahpql/typeDef/nft");
const fightDefs = require("./grahpql/typeDef/fight");
const tournamentDefs = require("./grahpql/typeDef/tournament");

const server = new ApolloServer({
    typeDefs: [userDefs, nftDefs, fightDefs, tournamentDefs],
    resolvers,
    context: ({ req }) => ({ req }),
});

//Once connection is establish we run server
db.once("open", async () => {
    await server
        .listen({ port: 4000 })
        .then((res) => console.log(`Server ${res.url}`))
        .catch((error) => console.log(error));
});
