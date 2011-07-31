var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var performedWorkSchema = new Schema({
	date: { type: Date, required: true },
	hours: { type: Number, min: 1, max: 16, required: true }
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
module.exports = mongoose.model('Activity');