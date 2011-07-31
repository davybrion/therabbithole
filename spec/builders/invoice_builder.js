var Invoice = require('../../lib/entities').Invoice;

var InvoiceBuilder = function() {
	this.companyId = '4e25937456436de850000001';
	this.customerId = '4e25937456436de850000002';
	this.invoiceNumber = '2011/01';
	this.date = new Date();
	this.dueDate = new Date();
	this.dueDate.setDate(this.date.getDate() + 30);
	this.activityId = '4e25937456436de850000003';
	this.totalHours = 160;
	this.hourlyRate = 75;
	this.totalExcludingVat = this.totalHours * this.hourlyRate;
};

var prototype = InvoiceBuilder.prototype;

prototype.withCompanyId = function(companyId) {
	this.companyId = companyId;
	return this;
};

prototype.withCustomerId = function(customerId) {
	this.customerId = customerId;
	return this;
};

prototype.withInvoiceNumber = function(invoiceNumber) {
	this.invoiceNumber = invoiceNumber;
	return this;
};

prototype.withDate = function(date) {
	this.date = date;
	return this;
};

prototype.withDueDate = function(dueDate) {
	this.dueDate = dueDate;
	return this;
};

prototype.withActivityId = function(activityId) {
	this.activityId = activityId;
	return this;
};

prototype.withTotalHours = function(totalHours) {
	this.totalHours = totalHours;
	return this;
};

prototype.withHourlyRate = function(hourlyRate) {
	this.hourlyRate = hourlyRate;
	return this;
};

prototype.withTotalExcludingVat = function(totalExcludingVat) {
	this.totalExcludingVat = totalExcludingVat;
	return this;
};

prototype.asPaid = function() {
	this.paid = true;
	return this;
};

prototype.build = function() {
	var invoice = new Invoice({
		companyId: this.companyId,
		customerId: this.customerId,
		invoiceNumber: this.invoiceNumber,
		date: this.date,
		dueDate: this.dueDate,
		activityId: this.activityId,
		totalHours: this.totalHours,
		hourlyRate: this.hourlyRate,
		totalExcludingVat: this.totalExcludingVat
	});
	if (this.paid !== undefined) { invoice.paid = this.paid; }
	return invoice;
};

module.exports = InvoiceBuilder;