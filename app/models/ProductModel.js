var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProductSchema = new Schema({
	'name' : String,
    'quantity' : Number,
	'price' : Number,
	'createdon' : {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Product', ProductSchema);