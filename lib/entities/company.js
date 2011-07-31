var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var companySchema = new Schema({
	name: { type: String, required: true},
	address: {
		street: { type: String, required: true },
		postalCode: { type: String, required: true },
		city: { type: String, required: true },
		country: String
	},
	phoneNumber: { type: String, required: true},
	email: { type: String, required: true},
	vatNumber: { type: String, required: true },
	bankAccount: { type: String, required: true},
	iban: { type: String, required: true},
	bic: { type: String, required: true}
	// TODO: logo (either binary stream or file path)
});

mongoose.model('Company', companySchema);
module.exports = mongoose.model('Company');