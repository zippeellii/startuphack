var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AdSchema = new Schema({
  name: {type: String, required: true},
  image: {type: String, required: false},
  description: {type: String, required: false},
  price: {type: Number, min: 0, required: false},
  fromSite: {type: String, required: true},
  city: {type: String, required: false},
  country: {type: String, required: false},
  url: {type: String, required: true},
  currency: {type: String, required: false, enum: ['USD', 'SEK', 'UNKNOWN']},
  isAuction: {type: Boolean, required: true},
  auctionPrice: {type: Number, required: false}
});

module.exports = mongoose.model('Ad', AdSchema);
