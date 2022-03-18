const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { validateUser, validateLogin, validateUserUpdate } = require("../../helpers/validators");
const checkAuth = require("../../middleware/checkAuth");
const Nft = require("../../models/Nft");

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
    );
}

module.exports = {
    Query: {
        //NOTE: we can probably just use the auth context.
        async getUser(_, { userID }) {
            try {
                const user = await User.findById(userID);
                if (user) {
                    return user;
                } else {
                    throw new Error("Did not find a user");
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async getAllUsers(_) {
            try {
                const user = await User.find();
                if (user) {
                    return user;
                } else {
                    throw new Error("Did not find a user");
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async getUserNfts(_, __, context) {
            try {
                const { id } = checkAuth(context);
                const nfts = await Nft.find({ user: id }).populate("user");
                return nfts;
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    //Mutations allow you to modify server-side data, and it also returns an object based on the operation performed.
    // It can be used to insert, update, or delete data.
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLogin(username, password);

            //Validate input fields
            if (!valid) throw new UserInputError("Errors", { errors });

            const user = await User.findOne({ username });
            //Check if user exist
            if (!user) {
                errors.login = "User not found";
                throw new UserInputError("User not found", { errors });
            }
            //Check if passowrd matchs
            const compareUsers = await bcrypt.compare(password, user.password);
            if (!compareUsers) {
                errors.loging = "Wrong credentials";
                throw new UserInputError("Wrong Credentials", { errors });
            }
            //If everything checks we create new token session and return it
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user.id,
                token,
            };
        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            const { errors, valid } = validateUser(
                username,
                email,
                password,
                confirmPassword
            );

            //If any errors we throw an exception
            if (!valid) throw new UserInputError("Errors", { errors });
            //TODO: Put all this validation into the

            //We check if user already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError("Username already exist", {
                    errors: {
                        username: "This user is already taken",
                    },
                });
            }

            //We encrypt password before saving it
            password = await bcrypt.hash(password, 12); //We await because bcrypt is async
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date(),
            });

            const result = await newUser.save();
            //We create token auth
            const token = generateToken(result);

            //Return user object and token
            return {
                ...result._doc,
                id: result.id,
                token,
            };
        },

        async updateUser(_, { user }) {
            // I think I need to be passing in the full obj then looping over all the values that are different. 
            const { id, email, username } = user;
            const currentUser = await User.findById(id);
            const {email: currentEmail , username: currentUsername } = currentUser; 
            // foreach of the values you want to send through check if they are different only send through the actual differences. 

            const {errors, valid} = await validateUserUpdate(email, username, currentEmail, currentUsername);
            if (!valid) throw new UserInputError('Errors', { errors });
            
            Object.assign(currentUser, user);
            currentUser.save();
            return currentUser;
        },

        async deleteUser(_, { userId }) {
            //TODO: add validation checking if admin account. & the ability to delete own account.
            try {
                const user = await User.findById(userId);
                console.log(user);

                if (user) {
                    const result = await User.deleteOne({ _id: userId });
                    return result;
                } else {
                    throw new Error("A user with that Id does not exist");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        async addAmount(_, { amount }, context) {
            const { username } = checkAuth(context);

            try {
                const user = await User.findOne({ username });
                if (user) {
                    user.amountInWallet = user.amountInWallet + amount;
                    await user.save();
                    return user;
                } else {
                    throw new Error("User does not exist.");
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async removeAmount(_, { amount }, context) {
            const { username } = checkAuth(context);

            try {
                const user = await User.findOne({ username });

                if (user) {
                    if (user.amountInWallet >= amount) {
                        user.amountInWallet = user.amountInWallet - amount;
                        await user.save();
                        return user;
                    } else {
                        throw new UserInputError(
                            "You do not have enough funds in your wallet."
                        );
                    }
                } else {
                    throw new UserInputError("User does not exist.");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};