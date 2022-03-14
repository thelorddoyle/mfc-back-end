const postResolvers = require('./post');
const userResolvers = require('./user');
const commentResolvers = require('./comment');

module.exports = {

    Post: { //Modifier, everytime a Post Type is return we modified and return data ie: likeCount, commentCount
        likeCount(parent){
            return parent.likes.length
        },
        commentCount(parent){
            return parent.comments.length
        }
    },
    Query: {
        ...postResolvers.Query
    },

    Mutation:{
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
    }

}