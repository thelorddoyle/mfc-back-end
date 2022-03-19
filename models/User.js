const { model, Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

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

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

module.exports = model('User', userSchema);