const gql = require('graphql-tag');
//Graph-QL Queries
module.exports = gql`
    scalar Date,
        
    type User { #User model type
        id: ID!, 
        email: String!
        token: String!
        username: String!
        createdAt: Date!
        amountInWallet: Float
    },

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
        fightReplay: [fightMove]!,
        tournamentIndex: Int!
    }

    type Tournament {
        startDate: Date,
        status: String
    }   


    type fightMove{
        ownerId: String!,
        body: String!,
    }

    input CreateFightMove{
        ownerId: String!,
        body: String!,
    }

    input UserInput { #User model type
        id: ID!, 
        email: String
        token: String
        username: String
        createdAt: Date
    },

    input CreateTournament{
        startDate: Date,
        status: String
    }

    input CreateFight{
        winnerId: String!,
        loserId: String!,
        fightReplay: [CreateFightMove]!,
        tournamentIndex: Int!
    }

    input CreateNft{
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
    
    input RegisterInput{ #Diferent "type" for handling form data 
        username: String!,
        password: String!,
        confirmPassword: String!,
        email: String!,
        amountInWallet: Float
    }, 

    type Result{
      deletedCount: Int!  
    },

    type Query{
        getUser(userID: ID!): User,
        getAllUsers: [User],
        getUserNfts: [Nft],

        getNfts: [Nft]!,
        getNft(nftID: ID!): Nft!,

        getTournaments: [Tournament],
        getTournament(tournamentId: ID!): Tournament
        getFights: [Fight]
    },

    type Mutation{
        register(registerInput: RegisterInput): User!,
        login(username: String!, password: String!): User!,
        addAmount(amount: Float!): User!,
        removeAmount(amount: Float!): User!,
        updateUser(user: UserInput): User!,
        deleteUser(userId: ID!): Result!,
        
        createNft(createNft: CreateNft): Nft!,
        mintNft(userId: ID!): Nft!,

        createTournament(createTournament: CreateTournament): Tournament!, 
        createFight(createFight: CreateFight): Fight!
    }
    

`

//TODO: figure out if you can have no response or if it is an error;