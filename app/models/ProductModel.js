var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProductSchema = new Schema({
	'name' : String,
    'quantity' : Number,
	'price' : Number,
	'createdon' : {type: Date, default: Date.now()},
	'product_id': String
});

module.exports = mongoose.model('Product', ProductSchema);