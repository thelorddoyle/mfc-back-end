const gql = require('graphql-tag');
//Graph-QL Queries
module.exports = gql`
    scalar Date,
    type Post{ #Post model Type
        id: ID!,  #Exclamation mark means that is required
        body: String!,
        username: String!,
        createdAt: Date!,
        comments:[Comment]!, #If you put the exclamation mark inside array it means at least one element must be present
        likes: [Like]!,
        likeCount: Int!,
        commentCount: Int!,

    },

    type Comment{
        id: ID!,
        createdAt: Date!,
        username: String!,
        body: String!
    },

    type Like{
        id: ID!,
        username: String!,
        createdAt: Date!,
    },
        
    type User { #User model type
        id: ID!, 
        email: String!
        token: String!
        username: String!
        createdAt: Date!
        amountInWallet: Float
    },
    
    input RegisterInput{ #Diferent "type" for handling form data 
        username: String!,
        password: String!,
        confirmPassword: String!,
        email: String!,
        amountInWallet: Float
    }, 

    type Query{
        getPosts:[Post],
        getPost(postID: ID!): Post,
    },

    type Mutation{
        register(registerInput: RegisterInput): User!,
        login(username: String!, password: String!): User!,
        createPost(body: String!): Post!,
        deletePost(postID: ID!): Post!,
        createComment(postID: String!, body: String!): Post!,
        deleteComment(postID: String!, commentID: String!): Post!,
        likePost(postID: String!): Post!,
        addAmount(amount: Float!): User!,
        removeAmount(amount: Float!): User!
    }

`