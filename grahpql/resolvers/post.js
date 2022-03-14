//RESOLVERS
//For each query or mutuation there is a resolver, which processes any sort of logic 
const Post = require('../../models/Post');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');


module.exports =  {
    Query: {
        async getPosts(){
            try {
                const result = await Post.find().sort({createdAt: 'asc'});
                return result
            } catch (error) {
                throw new Error(error);
            }
        },

        async getPost(_,{postID}){
            try {
                const result =  await Post.findById(postID);
                if (result){
                    return result
                }else{
                    throw new Error('Post not found')
                }
                
            } catch (error) {
                throw new Error('Post not found')
            }
        }
    },

    Mutation: {
        async createPost(_, {body}, context){
           if(body.trim() === "") throw new Error("Post must not be empty")
           const user = checkAuth(context);
           const newPost = new Post({
               body,
               user: user.id,
               username: user.username,
               createdAt: new Date()
           })
           const post = await newPost.save();
           return post
        },


        async deletePost(_, {postID}, context){
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postID)
                if(!post) throw new Error("Post Not Found")
                if(user.username === post.username){
                    const deletedPost = await post.delete();
                    return 'Post Deleted'
                }else{
                    throw new AuthenticationError("Forbidden, Action not allow")
                }
            } catch (error) {
                throw new Error(error)
            }
           
        },   
        async likePost(_,{postID}, context){
            const {username} = checkAuth(context);
            const post = await Post.findById(postID)
            if(!post) throw new UserInputError("Post Not Found")

            if(post.likes.find(el => el.username === username)){
                //it means already liked the post, we are going to 'unlike' the post 
                post.likes = post.likes.filter(el => el.username !== username);
            }else{
               post.likes.push({
                   username,
                   createdAt: new Date(),
               })
            }
            await post.save();
            return post;
        }
    },

}