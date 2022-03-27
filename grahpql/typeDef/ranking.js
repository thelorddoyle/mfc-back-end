const gql = require('graphql-tag');

module.exports = gql `

    type Ranking {
        id: ID!,
        fightCount: Number!, 
        winCount: Number!, 
        ranking: Number!,
        user: User
    }   

    type Query{

        getRankings: [Ranking],
        getRanking(nftId: ID!): Ranking!,

    },

    type Mutation{


    }

`