const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: Date,
    amountInWallet: { type: Number, default: 0 },
    nfts: [{
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    }]
})

module.exports = model('User', userSchema);