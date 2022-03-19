const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const {
    validateUser,
    validateLogin,
    validateUserUpdate
} = require("../../helpers/validators");
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

const checkPositive = (amount) => {
    if (amount < 0){
        throw new UserInputError('You cannot input a negative number')
    }
}

module.exports = {
    generateToken, 
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

        async getMyNfts(_, __, context) {
            try {
                const { id } = checkAuth(context);
                const nfts = await Nft.find({ user: id }).populate('fights');
                return nfts;
            } catch (error) {
                throw new Error(error);
            }
        },

        async getUserNfts(_, {userID}) {
            try {
                const nfts = await Nft.find({ user: userID }).populate({
                    path: 'fights',
                    populate: {path: 'tournament'}
                });
                return nfts;
            } catch (error) {
                throw new Error(error);
            }
        },
        async getAllMyTournaments(_, {}, context){
            try {
                // returns me the user ID of the request
                const { id } = checkAuth(context);

                let myTournamentsWithDuplicates = [];

                // gets all of the NFTs that this user has
                try {
                    const nfts = await Nft.find({ user: id }).populate({
                        path: 'fights',
                        populate: {path: 'tournament'}
                    });

                    for (i=0; i<nfts.length; i++) {

                        // this is an array of fights that each NFT has
                        const nftFights = nfts[i].fights

                        // go through each array of fights to find the tournament
                        nftFights.forEach(fight => {
                            myTournamentsWithDuplicates.push(fight.tournament)
                        })
                    }
                    const myTournaments = [...new Map(myTournamentsWithDuplicates.map(tourney => [tourney._id, tourney])).values()]
                    return myTournaments

                } catch (error) {
                    throw new Error(error);
                }


            } catch (error) {
                throw new Error(error);

            }
        }
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
            const { errors, valid } = await validateUser(
                username,
                email,
                password,
                confirmPassword
            );

            if (!valid) throw new UserInputError("Errors", { errors }); //If any errors we throw an exception

            password = await bcrypt.hash(password, 12); //Encrypt password before saving it
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date(),
            });
            const result = await newUser.save(); //TODO: refactor this to use User.create()

            const token = generateToken(result);

            //Return user object and token
            return {
                ...result._doc,
                id: result.id,
                token,
            };
        },

        // validates a change in email, username
        async updateUser(_, { user }, context) {
            const { id } = checkAuth(context);
            const currentUser = await User.findOne({ id });
            const { email, username } = user; //NOTE: id is userId and email and username are the new values(to update to).
            const { errors, valid } = await validateUserUpdate(
                email,
                username,
                currentUser
            );
            if (!valid) throw new UserInputError("Errors", { errors });
            
            Object.assign(currentUser, user); //changes only the
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
            // NOTE: this will probably be swapped out for defi integration.
            const { id } = checkAuth(context);

            try {
                checkPositive(amount)
                
                const user = await User.findOne({ id });
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
                checkPositive(amount)
                
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
