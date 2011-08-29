var mongoose = require('mongoose'),
	Invoice = require('../../lib/entities').Invoice,
	InvoiceBuilder = require('../builders/invoice_builder.js'),
	helper = require('../helper_functions.js');
	
mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('invoices').drop();

describe('given a new invoice', function() {
	
	var invoice = null,
		error = null;

	beforeEach(function() {
		invoice = new InvoiceBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {
		
		beforeEach(function() {
			invoice = new Invoice(); // the invoice reference by default points to a properly filled in instance
			invoice.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should fail with validation errors for each required field', function() {
			expect(error).not.toBeNull();
			expect(error).toHaveRequiredValidationErrorFor('company');
			expect(error).toHaveRequiredValidationErrorFor('customer');
			expect(error).toHaveRequiredValidationErrorFor('invoiceNumber');
			expect(error).toHaveRequiredValidationErrorFor('date');
			expect(error).toHaveRequiredValidationErrorFor('dueDate');
			expect(error).toHaveRequiredValidationErrorFor('activity');
			expect(error).toHaveRequiredValidationErrorFor('totalHours');
			expect(error).toHaveRequiredValidationErrorFor('hourlyRate');
			expect(error).toHaveRequiredValidationErrorFor('totalExcludingVat');
			expect(error).toHaveRequiredValidationErrorFor('vat');
			expect(error).toHaveRequiredValidationErrorFor('totalIncludingVat');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function() {
			invoice.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		afterEach(function() {
			// there's a unique index on invoice.invoiceNumber, if we don't remove it after
			// each spec, the next insert fails
			invoice.remove(function(err) {
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should not fail', function() {
			expect(error).toBeNull();
		});

		it('should contain a default false value for paid', function() {
			Invoice.findById(invoice.id, function(err, result) {
				expect(result.paid).toBe(false);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

});

describe('given an existing invoice', function() {
	
	var invoice = null;

	beforeEach(function() {
		invoice = new InvoiceBuilder().asPaid().build();
		invoice.save(function(err) {
			expect(err).toBeNull();
			asyncSpecDone();
		});
		asyncSpecWait();
	});

	afterEach(function() {
		if (invoice.removed) { return; }
		invoice.remove(function(err) {
			asyncSpecDone();
		});
		asyncSpecWait();
	});

	describe('when it is retrieved from the database', function() {
		
		var retrievedInvoice = null;

		beforeEach(function() {
			Invoice.findById(invoice.id, function(err, result) {
				expect(err).toBeNull();
				retrievedInvoice = result;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should contain the same values that have been inserted', function() {
			helper.invoicesShouldBeEqual(retrievedInvoice, invoice);
		});

	});

	describe('when it is modified and updated', function() {
		
		beforeEach(function() {
			invoice.company = '4e25937456436de850000009';
			invoice.customer = '4e25937456436de850000008';
			invoice.activity = '4e25937456436de850000007';
			invoice.invoiceNumber = '2011/02';
			invoice.date = new Date(invoice.date.getFullYear(), invoice.date.getMonth(), invoice.date.getDate() + 1);
			invoice.dueDate = new Date(invoice.dueDate.getFullYear(), invoice.dueDate.getMonth(), invoice.dueDate.getDate() + 1);
			invoice.totalHours = 168;
			invoice.hourlyRate = 74;
			invoice.totalExcludingVat = invoice.totalHours * invoice.hourlyRate;
			invoice.paid = false;

			invoice.save(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('contains the updated values in the database', function() {
			Invoice.findById(invoice.id, function(err, result) {
				helper.invoicesShouldBeEqual(result, invoice);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

	describe('when it is deleted', function() {
		beforeEach(function() {
			invoice.remove(function(err) {
				invoice.removed = true; // HACK: to avoid double removal in afterEach of parent suite
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('can no longer be retrieved', function() {
			Invoice.findById(invoice.id, function(err, result) {
				expect(result).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

});