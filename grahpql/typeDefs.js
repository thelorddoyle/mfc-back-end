const gql = require('graphql-tag');
//Graph-QL Queries
module.exports = gql`
    scalar Date,

    type Nft {
        id: ID!,
        userId: ID,
        background: String!,
        bodyType: String!,
        jewellery: String!, 
        tattoos: String!,
        hairStyle: String!,
        eyeColor: String!,
        facialHair: String!,
        clothing: String!, 
        shorts: String!,
        mouth: String!,
        headgear: String!,
        gloves: String!,
        bruisingOrBlood: String!,
        image: String!
    }

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

    type Tournament {
        id: ID!,
        startDate: Date,
        status: String,
        fights: [Fight]
    }   

    type Result{ # from deleting 
      deletedCount: Int!  
    },

    input CreateNft{
        id: ID,
        userId: ID,
        background: String,
        bodyType: String,
        jewellery: String, 
        tattoos: String,
        hairStyle: String,
        eyeColor: String,
        facialHair: String,
        clothing: String, 
        shorts: String,
        mouth: String,
        headgear: String,
        gloves: String,
        bruisingOrBlood: String,
        image: String
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

    input CreateTournament{
        startDate: Date,
        status: String
    }

    input TournamentInput{
        id: ID!,
        startDate: Date,
        status: String,
        fights:[FightInput]
    }

    type Query{
       
        ################
        ###    NFT   ###
        ################
        getNfts: [Nft]!,
        getNft(nftID: ID!): Nft!,

        ################
        ###  FIGHT   ###
        ################
        getFights: [Fight],
        getFight(fightId: ID!): Fight,

        ################
        ###TOURNAMENT###
        ################
        getTournaments: [Tournament],
        getTournament(tournamentId: ID!): Tournament!,
        getCurrentTournament: Tournament!

    },

    type Mutation{
        
        ################
        ###    NFT   ###
        ################
        createNft(createNft: CreateNft): Nft!,
        mintNft(userId: ID!): Nft!,

        ################
        ###  FIGHT   ###
        ################
        updateFight(fight: FightInput!): Fight

        ################
        ###TOURNAMENT###
        ################
        createTournament(createTournament: CreateTournament): Tournament!, 
        updateTournament(tournament: TournamentInput): Tournament!  

    }

`