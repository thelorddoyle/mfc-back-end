const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: Date,
    amountInWallet: { type: Number, default: 0 }

})

module.exports = model('User', userSchema); 