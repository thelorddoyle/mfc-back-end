const { model, Schema } = require('mongoose');

const nftSchema = new Schema({
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
  totalFights: Number, //this is for rankings page
  totalWins: Number, //this is for rankings page
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  fights:[{
    type: Schema.Types.ObjectId,
    ref: 'Fight'
  }]
})

module.exports = model('Nft', nftSchema); 