var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var customerSchema = new Schema({
	name: { type: String, required: true },
	address: {
		street: { type: String, required: true },
		postalCode: { type: String, required: true },
		city: { type: String, required: true },
		country: String
	},
	phoneNumber: String,
	vatNumber: { type: String, required: true },
	contact: {
		name: String,
		email: String
	},
	includeContactOnInvoice: { type: Boolean, required: true, default: false }
}); 

mongoose.model('Customer', customerSchema);
module.exports = mongoose.model('Customer');
