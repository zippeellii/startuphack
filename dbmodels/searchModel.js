var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SearchSchema = new Schema({
  searchQuery: {type: String, required: true},
  ads: [{type: ObjectId, Ref: 'Ad'}],
  minPrice: {type: Number, requiered: false},
  maxPrice: {type: Number, required: false},
  country: {type: String, enum: ['US', 'SE', 'ALL']}
}, {timestamps: true});


module.exports = mongoose.model('Search', SearchSchema);
