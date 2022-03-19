const gql = require('graphql-tag');

module.exports = gql`

    type Fight{
        id: ID!,
        fightIndex: Int!,
        tier: Int!
        winnerId: String,
        loserId: String,
        fightReplay: [FightMove]!,
        nfts: [Nft],
        tournament: Tournament
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
        nfts: [NftDetails]
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