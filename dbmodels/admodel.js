var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AdSchema = new Schema({
  name: {type: String, required: true},
  image: {type: String, required: false},
  description: {type: String, required: false},
  price: {type: Number, required: false},
  fromSite: {type: String, required: true}
});

module.exports = mongoose.model('Ad', AddSchema);
