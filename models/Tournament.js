const { model, Schema } = require('mongoose');

const tournamentSchema = new Schema({
    startDate: Date,
    round: Number,
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    },
    runnerUp: {
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    },
    status: {
        type: String,
        // pending: Tournament is being filled with NFTs in preparation for a tournament
        // ready: Tournament has 32 NFT's in it but NO fight logic has been completed
        // completed: After resolving fight logic for all fights in tournament ==> completed
        enum: ['pending', 'ready', 'completed'],
        default: 'pending'
    },
    
    fights: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Fight'
        }
    ],

})

module.exports = model('Tournament', tournamentSchema); 