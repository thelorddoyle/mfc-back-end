const gql = require('graphql-tag');

module.exports = gql`

    type Fight{
        id: ID!,
        winnerId: String,
        loserId: String,
        fightReplay: [FightMove]!,
        fightIndex: Int!,
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
        fightIndex: Int,
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