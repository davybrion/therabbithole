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
	customer: { type: ObjectId, required: true, ref: 'Customer' },
	description: { type: String, required: true },
	hourlyRate: { type: Number, required: true },
	performedWork: [performedWorkSchema],
	billed: { type: Boolean, required: true, default: false }
});

activitySchema.methods.addPerformedWork = function(date, hours) {
	var i = 0;
	for (i = 0, length = this.performedWork.length; i<length; i++) {
		if (this.performedWork[i].date.getFullYear() === date.getFullYear() &&
				this.performedWork[i].date.getMonth() === date.getMonth() &&
				this.performedWork[i].date.getDate() === date.getDate()) {
			throw new Error('performed work has already been added for ' + date);
		}
	}

	this.performedWork.push(new PerformedWork({ date: date, hours: hours }));
};

mongoose.model('Activity', activitySchema);
module.exports = mongoose.model('Activity');
