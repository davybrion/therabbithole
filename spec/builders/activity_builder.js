var Activity = require('../../lib/entities').Activity;

var ActivityBuilder = function() {
	this.customerId = '4e25937456436de850000006'; // should be a valid ObjectId (not an existing one, just valid in form) 
	this.description = "some cool project";
	this.hourlyRate = 75;
};

var prototype = ActivityBuilder.prototype;

prototype.withCustomerId = function(customerId) {
	this.customerId = customerId;
	return this;
};

prototype.withDescription = function(description) {
	this.description = description;
	return this;
};

prototype.withHourlyRate = function(hourlyRate) {
	this.hourlyRate = hourlyRate;
	return this;
};

prototype.asBilled = function() {
	this.billed = true;
	return this;
};

prototype.build = function() {
	var activity = new Activity({
		customerId: this.customerId,
		description: this.description,
		hourlyRate: this.hourlyRate
	});
	if (this.billed !== undefined) { activity.billed = this.billed; }
	return activity;
};

module.exports = ActivityBuilder;