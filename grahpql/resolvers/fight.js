const Tournament = require("../../models/Tournament");
const Fight = require("../../models/Fight");
const User = require("../../models/User");
const checkAuth = require("../../middleware/checkAuth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
    Query: {
        async getFights() {
            try {
                const result = await Fight.find().populate("nfts");
                return result;
            } catch (error) {
                throw new Error(error);
            }
        },

        async getFight(_, { fightId }) {
            try {
                const result = await Fight.findById(fightId).populate({
                    path: 'nfts',
                    populate: {path: 'user'}
                });
                if (result) {
                    return result;
                } else {
                    throw new Error("Fight not Found");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    Mutation: {
        async updateFight(_, { fight }) {
            try {
                const { id } = fight;
                const currentFight = await Fight.findById(id);

                Object.assign(currentFight, fight);
                currentFight.save();

                return currentFight;
            } catch (error) {
                throw new Error("error");
            }
        },
    },
};
