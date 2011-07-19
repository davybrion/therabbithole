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

	mongoose.model('Customer', customerSchema);
	var Customer = mongoose.model('Customer');

	var performedWorkSchema = new Schema({
		date: { type: Date, required: true },
		hours: { type: Number, min: 0, max: 8, required: true }
	});
	
	mongoose.model('PerformedWork', performedWorkSchema);
	var PerformedWork = mongoose.model('PerformedWork');
	
	var activitySchema = new Schema({
		customer: { type: ObjectId, required: true },
		description: { type: String, required: true },
		hourlyRate: { type: Number, required: true },
		performedWork: [performedWorkSchema],
		billed: { type: Boolean, required: true, default: false }
	});

	activitySchema.methods.addPerformedWork = function(date, hours) {
		// TODO: throw exception when adding a registration for a day that is already present in the array
		this.performedWork.push(new PerformedWork({ date: date, hours: hours }));
	};
	
	mongoose.model('Activity', activitySchema);
	var Activity = mongoose.model('Activity');

	return {
		Customer: Customer,
		Activity: Activity
	};
}());

module.exports = entities;