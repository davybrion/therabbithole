module.exports = {
	addressesShouldBeEqual: function(address1, address2) {
		if (address1 === null && address2 === null) { return; }
		if (address1 !== null) { expect(address2).not.toBeNull(); }
		if (address2 !== null) { expect(address1).not.toBeNull(); }
		expect(address1.street).toEqual(address2.street);
		expect(address1.city).toEqual(address2.city);
		expect(address1.postalCode).toEqual(address2.postalCode);
		expect(address1.country).toEqual(address2.country);
	},

	contactsShouldBeEqual: function(contact1, contact2) {
		if (contact1 === null && contact2 === null) { return; }
		if (contact1 !== null) { expect(contact2).not.toBeNull(); }
		if (contact2 !== null) { expect(contact1).not.toBeNull(); }
		expect(contact1.name).toEqual(contact2.name);
		expect(contact1.email).toEqual(contact2.email);
	},

	customersShouldBeEqual: function(customer1, customer2) {
		expect(customer1.name).toEqual(customer2.name);
		expect(customer1.vatNumber).toEqual(customer2.vatNumber);
		expect(customer1.phoneNumber).toEqual(customer2.phoneNumber);
		expect(customer1.includeContactOnInvoice).toEqual(customer2.includeContactOnInvoice);
		this.addressesShouldBeEqual(customer1.address, customer2.address);
		this.contactsShouldBeEqual(customer1.contact, customer2.contact);
	},

	performedWorkShouldBeEqual: function(performedWorkArray1, performedWorkArray2) {
		var i, lenght;
		expect(performedWorkArray1.length).toEqual(performedWorkArray2.length);
		for (i = 0, length = performedWorkArray1.length; i < length; i++) {
			expect(performedWorkArray1[i].date).toEqual(performedWorkArray2[i].date);
			expect(performedWorkArray1[i].hours).toEqual(performedWorkArray2[i].hours);
		}
	},

	activitiesShouldBeEqual: function(activity1, activity2) {
		expect(activity1.customer).toEqual(activity2.customer);
		expect(activity1.description).toEqual(activity2.description);
		expect(activity1.billed).toEqual(activity2.billed);
		expect(activity1.hourlyRate.toFixed()).toEqual(activity2.hourlyRate.toFixed());
		this.performedWorkShouldBeEqual(activity1.performedWork, activity2.performedWork);
	},

	companiesShouldBeEqual: function(company1, company2) {
		expect(company1.name).toEqual(company2.name);
		expect(company1.phoneNumber).toEqual(company2.phoneNumber);
		expect(company1.email).toEqual(company2.email);
		expect(company1.vatNumber).toEqual(company2.vatNumber);
		expect(company1.bankAccount).toEqual(company2.bankAccount);
		expect(company1.iban).toEqual(company2.iban);
		expect(company1.bic).toEqual(company2.bic);
		this.addressesShouldBeEqual(company1.address, company2.address);
	}
};