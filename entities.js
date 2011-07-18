var entities = (function() {
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;
		
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

	var performedWorkSchema = new Schema({
		date: { type: Date, required: true },
		hours: { type: Number, min: 0, max: 8, required: true }
	});

	var activitySchema = new Schema({
		customer: { type: ObjectId, required: true },
		description: { type: String, required: true },
		hourlyRate: { type: Number, required: true },
		performedWork: [performedWorkSchema],
		billed: { type: Boolean, required: true, default: false }
	});

	mongoose.model('Customer', customerSchema);
	mongoose.model('PerformedWork', performedWorkSchema);
	mongoose.model('Activity', activitySchema);

	return {
		Customer: mongoose.model('Customer'),
		Activity: mongoose.model('Activity'),
		PerformedWork: mongoose.model('PerformedWork')
	};
}());

module.exports = entities;