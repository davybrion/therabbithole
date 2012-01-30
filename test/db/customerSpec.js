var mongoose = require('mongoose'),
	Customer = require('../../lib/entities').Customer,
	CustomerBuilder = require('../builders/customer_builder.js'),
	should = require('should'),
	validationHelper = require('./mongoose_validation_helper.js'),
	equalityHelper = require('../equality_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('customers').drop();

describe('given a new customer', function() {

	var customer = null,
		error = null;

	beforeEach(function() {
		customer = new CustomerBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {

		beforeEach(function(done) {
			customer = new Customer(); // the customer reference by default points to a properly filled in instance
			customer.save(function(err) {
				error = err;
				done();
			});
		});

		it('should fail with validation errors for each required field', function() {
			should.exist(error);
			validationHelper.checkRequiredValidationErrorFor(error, 'name');
			validationHelper.checkRequiredValidationErrorFor(error, 'vatNumber');
			validationHelper.checkRequiredValidationErrorFor(error, 'address.street');
			validationHelper.checkRequiredValidationErrorFor(error, 'address.postalCode');
			validationHelper.checkRequiredValidationErrorFor(error, 'address.city');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {

		beforeEach(function(done) {
			customer.save(function(err) {
				error = err;
				done();
			});
		});

		it('should not fail', function() {
			should.not.exist(error);
		});

		it('should contain a default false value for includeContactOnInvoice', function(done) {
			Customer.findById(customer.id, function(err, result) {
				result.includeContactOnInvoice.should.be.false;
				done();
			});
		});

	});

});

describe('given an existing customer', function() {

	var customer = null;

	beforeEach(function(done) {
		customer = new CustomerBuilder()
			.withIncludeContactOnInvoice()
			.build();
			
		customer.save(function(err) {
			should.not.exist(err);
			done();
		});
	});

	describe('when it is retrieved from the database', function() {

		var retrievedCustomer = null;

		beforeEach(function(done) {
			Customer.findById(customer.id, function(err, result) {
				should.not.exist(err);
				retrievedCustomer = result;
				done();
			});
		});
	
		it('should contain the same values that have been inserted', function() {
			equalityHelper.customersShouldBeEqual(retrievedCustomer, customer);
		});
		
	});
	
	describe('when it is modified and updated', function() {
			
		beforeEach(function(done) {	
			customer.name = 'some other customer';
			customer.vatNumber = '0456.876.235';
			customer.address = {
				street: 'some other street',
				postalCode: '12345',
				city: 'some other city'
			};
			customer.phoneNumber = '123456789';
			customer.contact = {
				name: 'some name',
				email: 'some_email@hotmail.com'
			};
			customer.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('contains the updated values in the database', function(done) {
			Customer.findById(customer.id, function(err, result) {
				equalityHelper.customersShouldBeEqual(result, customer);
				done();
			});
		});

	});

	describe('when it is deleted', function() {
		
		beforeEach(function(done) {
			customer.remove(function(err) {
				should.not.exist(err);
				done();
			});
		});		

		it('can no longer be retrieved', function(done) {
			Customer.findById(customer.id, function(err, result) {
				should.not.exist(result);
				done();
			});
		});

	});
	
});
