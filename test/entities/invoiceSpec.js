var Invoice = require('../../lib/entities').Invoice;

describe('given an invoice', function() {

	var invoice = new Invoice();

	describe('when you set its totalExcludingVat property', function() {
		
		invoice.totalExcludingVat = 1000;

		it('should automatically set the vat property', function() {
			invoice.vat.valueOf().should.equal(210);
		});

		it('should automatically set the totalIncludingVat property', function() {
			invoice.totalIncludingVat.valueOf().should.equal(1210);
		});

	});
});

describe('given an invoice created with a totalExcludingVat value', function() {

	var invoice = new Invoice({ totalExcludingVat: 1000 });

	it('should contain the correct vat value', function() {
		invoice.vat.valueOf().should.equal(210);
	});

	it('should contain the correct totalIncludingVat property', function() {
		invoice.totalIncludingVat.valueOf().should.equal(1210);
	});
});
