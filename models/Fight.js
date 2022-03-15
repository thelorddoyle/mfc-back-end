const { model, Schema } = require('mongoose');

const fightSchema = new Schema({
    winnerId: String,
    loserId: String,
    fightReplay: [],
    tournamentIndex: Number,
    tournament: {
        type: Schema.Types.ObjectId, 
        ref: 'Tournament'
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    loser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

    //TODO: Make association with Tournament
})

module.exports = model('Fight', fightSchema); 