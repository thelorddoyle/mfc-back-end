const { model, Schema } = require('mongoose');

const fightSchema = new Schema({
    winnerId: String,
    loserId: String,
    fightSequence: [],
    tournamentPosition: Number,
    tournament: {
        type: Schema.Types.ObjectId, 
        ref: 'Tournament'
    }
})

module.exports = model('Fight', fightSchema); 