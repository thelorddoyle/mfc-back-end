const { model, Schema } = require('mongoose');
const nftSchema = new Schema({
  userId: String, 
  background: String,
  bodyType: String,
  jewellery: String, 
  tattoos: String,
  hairStyle: String,
  eyeColor: String,
  facialHair: String,
  clothing: String, 
  shorts: String,
  mouth: String,
  headgear: String,
  gloves: String,
  bruisingOrBlood: String,
  image: String,
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = model('Nft', nftSchema); 