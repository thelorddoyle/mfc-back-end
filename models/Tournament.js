const { model, Schema } = require('mongoose');

const tournamentSchema = new Schema({
    startDate: Date,
    status: {
        type: String,
        // status descriptions:
        // pending: while a tournament is being filled with NFTs in preparation for a tournament
        // ready: at this point, the tournament has 32 NFT's in it but NO fight logic has been completed
        // completed: immediately the entire tournament is resolved & results are ready to be demonstrated
        enum: ['pending', 'ready', 'completed'],
        
        default: 'pending'
    },

    
    // TODO: fix the association with fights
    fights: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Fight'
        }
    ],

    round: Number
})

module.exports = model('Tournament', tournamentSchema); 