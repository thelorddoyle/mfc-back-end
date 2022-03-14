const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');
const {validateUser, validateLogin } = require('../../helpers/validators');
const checkAuth = require('../../middleware/checkAuth')
 

function generateToken(user){
    return jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.SECRET_KEY, {expiresIn: '24h'});
}

module.exports = {
    //Mutations allow you to modify server-side data, and it also returns an object based on the operation performed. 
    // It can be used to insert, update, or delete data.
    Mutation : {

       async login(_, {username, password}){
            const {errors, valid } = validateLogin(username, password)

            //Validate input fields
            if(!valid) throw new UserInputError("Errors",{errors}); 

            const user = await User.findOne({username});
            //Check if user exist
            if(!user){
                errors.login = "User not found"
                throw new UserInputError("User not found",{errors})
            } 
            //Check if passowrd matchs
            const compareUsers = await bcrypt.compare(password, user.password);
            if(!compareUsers){
                errors.loging = "Wrong credentials";
                throw new UserInputError("Wrong Credentials", {errors});
            }
            //If everything checks we create new token session and return it
            const token =  generateToken(user)
            return {
                ...user._doc,
                id: user.id,
                token
            }
        },

        
       async register(_, {registerInput: {username, email,password,confirmPassword}}){

            const {errors, valid} = validateUser(username, email,password,confirmPassword);

            //If any errors we throw an exception
            if(!valid) throw new UserInputError("Errors",{errors});

            //We check if user already exist
            const user = await User.findOne({username});
            if(user){ 
                throw new UserInputError('Username already exist',{
                    errors:{
                        username: 'This user is already taken'
                    }
                })
            }

            //We encrypt password before saving it
            password = await bcrypt.hash(password, 12); //We await because bcrypt is async
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date()
            });


            const result = await newUser.save();
            //We create token auth
            const token = generateToken(result);

            //Return user object and token
            return {
                ...result._doc,
                id: result.id,
                token
            }
        },

        async addAmount(_, { amount }, context) {

            const { username } = checkAuth(context);

            try{
                const user = await User.findOne({username});
                if (user) {
                    user.amountInWallet = user.amountInWallet + amount
                    await user.save()
                    return user;
                } else {
                    throw new Error('User does not exist.')
                }

            } catch (err) {
                throw new Error(err)
            }

        },

        async removeAmount(_, { amount }, context) {

            const { username } = checkAuth(context);

            try{
                const user = await User.findOne({username});

                if (user) {
                    if(user.amountInWallet >= amount) {
                        user.amountInWallet = user.amountInWallet - amount
                        await user.save()
                        return user;
                    } else {
                        throw new UserInputError('You do not have enough funds in your wallet.')
                    }
                } else {
                    throw new UserInputError('User does not exist.')
                }

            } catch (err) {
                throw new Error(err)
            }

        }
    }
}