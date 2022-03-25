const gql = require('graphql-tag');

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

    type Result{ # from deleting 

        deletedCount: Int!  
      
    },

    input UserInput { #User model type
        email: String
        username: String
        
    },

    input UserUpdatePassowrd{
        currentPassowrd: String!
        password: String!
        confirmPassword: String!  
    }

    input RegisterInput{ #Diferent "type" for handling form data 
    
        username: String!,
        password: String!,
        confirmPassword: String!,
        email: String!,
        amountInWallet: Float
    }, 

	type Query{
		
        getUser(userID: ID!): User,
        getAllUsers: [User],
        getUserNfts(userID: ID!): [Nft],
        getMyNfts: [Nft],
        getAllMyTournaments: [Tournament]
		
	}

    type Mutation{

		register(registerInput: RegisterInput): User!,
		login(username: String!, password: String!): User!,
		addAmount(userId: ID!, amount: Float!): User!,
		removeAmount(amount: Float!): User!,
		updateUser(user: UserInput): User!,
        updatePassword(user: UserUpdatePassowrd): User!
		deleteUser(userId: ID!): Result!
        
	}
`