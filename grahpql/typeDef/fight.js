const gql = require('graphql-tag');

module.exports = gql`
    scalar Date,

    type Fight{
        id: ID!,
        winnerId: String!,
        loserId: String!,
        fightReplay: [FightMove]!,
        tournamentIndex: Int!,
        nfts: [Nft]
    }

    type FightMove{
        ownerId: String!,
        body: String!,
    }

    input FightInput{
        id: ID!,
        winnerId: String,
        loserId: String,
        fightReplay: [CreateFightMove],
        tournamentIndex: Int,
        nfts: [CreateNft]
    }

        
    input CreateFightMove{
        ownerId: String!,
        body: String!,
    }


    type Query{

       getFights: [Fight],
       getFight(fightId: ID!): Fight,

   },

   type Mutation{

        ################
        ###  FIGHT   ###
        ################
        updateFight(fight: FightInput!): Fight

    }
`