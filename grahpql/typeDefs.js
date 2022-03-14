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

    type Tournament {
        startDate: Date,
        status: String
    }

    input CreateTournament{
        startDate: Date,
        status: String
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

    type Query{
        getNfts:[Nft],
        getNft(nftID: ID!): Nft,
        getUser(userID: ID!): User,
        getAllUsers: [User],
        getUserNfts: [Nft]
    },

    type Mutation{
        register(registerInput: RegisterInput): User!,
        login(username: String!, password: String!): User!,
        addAmount(amount: Float!): User!,
        removeAmount(amount: Float!): User!,
        createNft(createNft: CreateNft): Nft!,
        mintNft(userId: ID!): Nft!,
        createTournament(createTournament: CreateTournament): Tournament
    }
    

`