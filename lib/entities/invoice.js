var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var invoiceSchema = new Schema({
	companyId: { type: ObjectId, required: true },
	customerId: { type: ObjectId, required: true },
	invoiceNumber: { type: String, required: true, unique: true },
	date: { type: Date, required: true },
	dueDate: { type: Date, required: true }, 
	paid: { type: Boolean, required: true, default: false },
	activityId: { type: ObjectId, required: true },
	totalHours: { type: Number, required: true },
	hourlyRate: { type: Number, required: true },
	totalExcludingVat: { type: Number, required: true }, // TODO: set this automatically based on hourlyRate and totalHours
	vat: { type: Number, required: true }, 
	totalIncludingVat: { type: Number, required: true } 
});

invoiceSchema.path('totalExcludingVat').set(function(value) {
	this.vat = value * 0.21;
	this.totalIncludingVat = value * 1.21;
	return value;
});

mongoose.model('Invoice', invoiceSchema);
module.exports = mongoose.model('Invoice');