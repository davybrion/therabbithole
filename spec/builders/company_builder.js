var Company = require('../../entities').Company;

var CompanyBuilder = function() {
	this.name = 'some company';
	this.address = {
		street: 'some street',
		postalCode: '1234',
		city: 'some city'
	};
	this.phoneNumber = '123456789';
	this.email = 'contact@mycompany.com';
	this.vatNumber = '0456.876.232';
	this.bankAccount = 'BE95 1234 5678 9012';
	this.iban = 'BE95 1234 5678 9012';
	this.bic = 'KREDBEBB';
};

var prototype = CompanyBuilder.prototype;

prototype.withName = function(name) {
	this.name = name;
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

prototype.withEmail = function(email) {
	this.email = email;
	return this;
};

prototype.withVatNumber = function(vatNumber) {
	this.vatNumber = vatNumber;
	return this;
};

prototype.withBankAccount = function(bankAccount) {
	this.bankAccount = bankAccount;
	return this;
};

prototype.withIban = function(iban) {
	this.iban = iban;
	return this;
};

prototype.withBic = function(bic) {
	this.bic = bic;
	return this;
};

prototype.build = function() {
	var company = new Company({
		name: this.name,
		address: this.address,
		phoneNumber: this.phoneNumber,
		email: this.email,
		vatNumber: this.vatNumber,
		bankAccount: this.bankAccount,
		iban: this.iban,
		bic: this.bic
	});
	return company;
};

module.exports = CompanyBuilder;