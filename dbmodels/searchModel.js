var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SearchSchema = new Schema({
  searchQuery: {type: String, required: true},
  ads: [{type: ObjectId, Ref: 'Ad'}]
},{timestamps: true});


module.exports = mongoose.model('Search', SearchSchema);
