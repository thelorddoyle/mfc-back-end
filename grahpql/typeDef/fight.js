const gql = require('graphql-tag');

module.exports = gql`

    type Fight{
        id: ID!,
        winnerId: String,
        loserId: String,
        fightReplay: [FightMove]!,
        tournamentIndex: Int!,
        nfts: [Nft]
    }

    type FightMove{
        attackerId: String!,
        defenderId: String!,
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
        attackerId: String!,
        defenderId: String!,
        body: String!,
    }


    type Query{

       getFights: [Fight],
       getFight(fightId: ID!): Fight,

   },

   type Mutation{
       
        updateFight(fight: FightInput!): Fight

    }
`