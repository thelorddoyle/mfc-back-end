const { model, Schema } = require("mongoose");

const rankingSchema = new Schema({
    fightCount: Number, 
    winCount: Number, 
    ranking: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = model("Ranking", rankingSchema);