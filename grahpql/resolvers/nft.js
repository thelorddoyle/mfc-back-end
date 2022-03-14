//RESOLVERS
//For each query or mutuation there is a resolver, which processes any sort of logic 
const Nft = require('../../models/Nft');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');


module.exports =  {
    Query: {
        async getNfts(){
            try {
                const result = await Nft.find();
                return result
            } catch (error) {
                throw new Error(error);
            }
        },

        async getNft(_,{nftID}){
            try {
                const result =  await Nft.findById(nftID);
                if (result){
                    return result
                }else{
                    throw new Error('Nft not found')
                }
                
            } catch (error) {
                throw new Error('Nft not found')
            }
        }


    },

    Mutation: {
        async createNft(_, {createNft}, context){
          try{
            const nft = await Nft({...createNft})
            await nft.save();

            return nft;
          } catch(err){
            throw new Error(err);
          }
          console.log('createNft', createNft);
        },
        
        async mintNft(_, {userId}, context){
          try{
            const nft = await Nft.findOne({userId: null});
            console.log(nft);
            nft.userId = userId;
            console.log(nft);
            await nft.save();

            return nft;
          } catch(err){
            throw new Error(err);
          }
          console.log('createNft', createNft);
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