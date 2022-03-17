const { model, Schema } = require('mongoose');

const fightSchema = new Schema({
    winnerId: String,
    loserId: String,
    fightReplay: [],
    tournamentIndex: Number,
    tier: Number,
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
    },
    nfts: [{
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    }],

    //TODO: Make association with Tournament
})

module.exports = model('Fight', fightSchema); 