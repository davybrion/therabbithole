var mongoose = require('mongoose'),
	Invoice = require('../../lib/entities').Invoice,
	InvoiceBuilder = require('../builders/invoice_builder.js'),
	Customer = require('../../lib/entities').Customer,
	CustomerBuilder = require('../builders/customer_builder.js'),
	Company = require('../../lib/entities').Company,
	CompanyBuilder = require('../builders/company_builder.js'),
	Activity = require('../../lib/entities').Activity,
	ActivityBuilder = require('../builders/activity_builder.js'),
	should = require('should'),
	mongooseTestHelper = require('./persistence_spec_functions.js'),
	validationHelper = require('./mongoose_validation_helper.js'),
	equalityHelper = require('../equality_functions.js');
	
mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('invoices').drop();

describe('given a new invoice', function() {
	
	var invoice = null,
		error = null;

	beforeEach(function() {
		invoice = new InvoiceBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {
		
		beforeEach(function(done) {
			invoice = new Invoice(); // the invoice reference by default points to a properly filled in instance
			invoice.save(function(err) {
				error = err;
				done();
			});
		});

		it('should fail with validation errors for each required field', function() {
			should.exist(error);
			validationHelper.checkRequiredValidationErrorFor(error, 'company');
			validationHelper.checkRequiredValidationErrorFor(error, 'customer');
			validationHelper.checkRequiredValidationErrorFor(error, 'invoiceNumber');
			validationHelper.checkRequiredValidationErrorFor(error, 'date');
			validationHelper.checkRequiredValidationErrorFor(error, 'dueDate');
			validationHelper.checkRequiredValidationErrorFor(error, 'activity');
			validationHelper.checkRequiredValidationErrorFor(error, 'totalHours');
			validationHelper.checkRequiredValidationErrorFor(error, 'hourlyRate');
			validationHelper.checkRequiredValidationErrorFor(error, 'totalExcludingVat');
			validationHelper.checkRequiredValidationErrorFor(error, 'vat');
			validationHelper.checkRequiredValidationErrorFor(error, 'totalIncludingVat');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function(done) {
			invoice.save(function(err) {
				error = err;
				done();
			});
		});

		afterEach(function(done) {
			// there's a unique index on invoice.invoiceNumber, if we don't remove it after
			// each spec, the next insert fails
			invoice.remove(function(err) {
				done();
			});
		});

		it('should not fail', function() {
			should.not.exist(error);
		});

		it('should contain a default false value for paid', function(done) {
			Invoice.findById(invoice.id, function(err, result) {
				result.paid.should.be.false;
				done();
			});
		});

	});

	mongooseTestHelper.create_entity_with_reference_and_check_populate({
		buildReferenceEntityFn: function() { 
			return new CustomerBuilder().build(); 
		},
		referenceName: 'customer',
		entityName: 'invoice',
		getEntityFn: function() {
			return invoice;
		},
		entityModel: Invoice,
		equalityFn: equalityHelper.customersShouldBeEqual,
		remove_entity_in_afterEach: true
	});

	mongooseTestHelper.create_entity_with_reference_and_check_populate({
		buildReferenceEntityFn: function() {
			return new CompanyBuilder().build();
		},
		referenceName: 'company',
		entityName: 'invoice',
		getEntityFn: function() {
			return invoice;
		},
		entityModel: Invoice,
		equalityFn: equalityHelper.companiesShouldBeEqual,
		remove_entity_in_afterEach: true
	});

	mongooseTestHelper.create_entity_with_reference_and_check_populate({
		buildReferenceEntityFn: function() {
			return new ActivityBuilder().build();
		},
		referenceName: 'activity',
		entityName: 'invoice',
		getEntityFn: function() {
			return invoice;
		},
		entityModel: Invoice,
		equalityFn: equalityHelper.activitiesShouldBeEqual,
		remove_entity_in_afterEach: true
	});

});

describe('given an existing invoice', function() {
	
	var invoice = null;

	beforeEach(function(done) {
		invoice = new InvoiceBuilder().asPaid().build();
		invoice.save(function(err) {
			should.not.exist(err);
			done();
		});
	});

	afterEach(function(done) {
		if (invoice.removed) { done(); }
		invoice.remove(function(err) {
			done();
		});
	});

	describe('when it is retrieved from the database', function() {
		
		var retrievedInvoice = null;

		beforeEach(function(done) {
			Invoice.findById(invoice.id, function(err, result) {
				should.not.exist(err);
				retrievedInvoice = result;
				done();
			});
		});

		it('should contain the same values that have been inserted', function() {
			equalityHelper.invoicesShouldBeEqual(retrievedInvoice, invoice);
		});

	});

	describe('when it is modified and updated', function() {
		
		beforeEach(function(done) {
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
				should.not.exist(err);
				done();
			});
		});

		it('contains the updated values in the database', function(done) {
			Invoice.findById(invoice.id, function(err, result) {
				equalityHelper.invoicesShouldBeEqual(result, invoice);
				done();
			});
		});

	});

	describe('when it is deleted', function() {
		beforeEach(function(done) {
			invoice.remove(function(err) {
				invoice.removed = true; // HACK: to avoid double removal in afterEach of parent suite
				should.not.exist(err);
				done();
			});
		});

		it('can no longer be retrieved', function(done) {
			Invoice.findById(invoice.id, function(err, result) {
				should.not.exist(result);
				done();
			});
		});

	});

});