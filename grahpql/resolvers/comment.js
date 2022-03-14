const checkAuth = require("../../middleware/checkAuth")
const Post = require("../../models/Post")
const {UserInputError} = require('apollo-server')

module.exports = {
    Mutation: {
        async createComment(_ ,{ postID, body }, context){
            const {username} = checkAuth(context);
            if(body.trim() === ""){
                throw new UserInputError('Empty comment', {
                    errors:{
                        body: 'Comment can not be empty'
                    }
                })
            }
            const post = await Post.findById(postID);
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date()
                })
                await post.save();
                return post;
            }else{
               throw new UserInputError('Post Not found');
            }
        },

        async deleteComment(_, { postID, commentID }, context){
            const {username} = checkAuth(context);
            try {
                const post = await Post.findById(postID)
                if(!post) throw new UserInputError("Post Not Found")
                const commentToDelete = post.comments.findIndex(el => el.id === commentID)
                //We check if that comment belongs to user and delete it.
                if(post.comments[commentToDelete].username === username){
                    post.comments.splice(commentToDelete, 1);
                    await post.save();
                    return post;
                }else{
                    throw new UserInputError("Forbidden, Action not allow")
                }
            } catch (error) {
                throw new Error(error)
            }
        },
    }
}