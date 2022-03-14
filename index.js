const { ApolloServer } = require('apollo-server');
const db = require('./config/db');
const typeDefs  = require('./grahpql/typeDefs');
const resolvers  = require('./grahpql/resolvers/index');


const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context: ({ req }) =>({req})
})

//Once connection is establish we run server
db.once('open', async () => {
    await server.listen({port:4000})
            .then(res => console.log(`Server ${res.url}`))
            .catch(error => console.log(error));
});
