const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: Date,
    profileImage: { type: String, default: 'https://res.cloudinary.com/metaverse-fc/image/upload/c_scale,w_200/v1647822682/Logos%20And%20Icons/Fighters_nuxtbz.png'},
    amountInWallet: { type: Number, default: 0 },
    nfts: [{
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    }]
})

module.exports = model('User', userSchema);