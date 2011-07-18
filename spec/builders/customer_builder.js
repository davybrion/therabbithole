var Customer = require('../../entities.js').Customer;

var CustomerBuilder = function() {
	this.name = 'some customer';
	this.vatNumber = '0456.876.234';
	this.address = {
		street: "some street",
		postalCode: "1234",
		city: "some city"
	};
};

var prototype = CustomerBuilder.prototype;

prototype.withName = function(name) {
	this.name = name;
	return this;
};

prototype.withVatNumber = function(vatNumber) {
	this.vatNumber = name;
	return this;
};

prototype.withAddress = function(address) {
	this.address = address;
	return this;
};

prototype.withPhoneNumber = function(phoneNumber) {
	this.phoneNumber = phoneNumber;
	return this;
};

prototype.withContact = function(contact) {
	this.contact = contact;
	return this;
};

prototype.includeContactOnInvoice = function() {
	this.includeContactOnInvoice = true;
	return this;
};

prototype.build = function() {
	var customer = new Customer();
	customer.name = this.name;
	customer.vatNumber = this.vatNumber;
	customer.address = this.address;
	if (this.phoneNumber) { customer.phoneNumber = this.phoneNumber; }
	if (this.contact) { customer.contact = this.contact; }
	if (this.includeContactOnInvoice) { customer.includeContactOnInvoice = this.includeContactOnInvoice; }
	return customer;
};

module.exports = CustomerBuilder;