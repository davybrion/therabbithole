var Activity = require('../../lib/entities.js').Activity,
	ObjectId = require('mongoose').Schema.ObjectId;

var ActivityBuilder = function() {
	this.customer = '4e25937456436de850000006'; // this can really be of any type
	this.description = "some cool project";
	this.hourlyRate = 75;
	this.performedWork = [];
};

var prototype = ActivityBuilder.prototype;

prototype.withCustomerId = function(customerId) {
	this.customer = customerId;
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
		customer: this.customer,
		description: this.description,
		hourlyRate: this.hourlyRate
	});
	if (this.billed !== undefined) { activity.billed = this.billed; }
	return activity;
};

module.exports = ActivityBuilder;