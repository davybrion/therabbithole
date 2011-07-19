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
	activitiesShouldBeEqual: function(activity1, activity2) {
		expect(activity1.customer).toEqual(activity2.customer);
		expect(activity1.description).toEqual(activity2.description);
		expect(activity1.billed).toEqual(activity2.billed);
		expect(activity1.hourlyRate.toFixed()).toEqual(activity2.hourlyRate.toFixed());
		// TODO: add check for performedWork!
	}
};