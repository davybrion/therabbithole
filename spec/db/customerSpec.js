var mongoose = require('mongoose'),
	Customer = require('../../lib/entities.js').Customer,
	CustomerBuilder = require('../builders/customer_builder.js'),
	helper = require('../helper_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('customers').drop();

describe('given a new customer', function() {

	var customer = null,
		error = null;

	beforeEach(function() {
		customer = new CustomerBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {

		beforeEach(function() {
			customer = new Customer(); // the customer reference by default points to a properly filled in instance
			customer.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should fail with validation errors for each required field', function() {
			expect(error).not.toBeNull();
			expect(error).toHaveRequiredValidationErrorFor('name');
			expect(error).toHaveRequiredValidationErrorFor('vatNumber');
			expect(error).toHaveRequiredValidationErrorFor('address.street');
			expect(error).toHaveRequiredValidationErrorFor('address.postalCode');
			expect(error).toHaveRequiredValidationErrorFor('address.city');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {

		beforeEach(function(err) {
			customer.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should not fail', function() {
			expect(error).toBeNull();
		});

		it('should contain a default false value for includeContactOnInvoice', function() {
			Customer.findById(customer.id, function(err, result) {
				expect(result.includeContactOnInvoice).toBe(false);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

});

describe('given an existing customer', function() {

	var customer = null;

	beforeEach(function(err) {
		customer = new CustomerBuilder()
			.withAddress({ street: 'some street', city: 'some city', postalCode: '1234', country: 'some country' })
			.withPhoneNumber('123456789')
			.withContact({ name: 'some name', email: 'some.email@gmail.com' })
			.withIncludeContactOnInvoice()
			.build();
			
		customer.save(function(err) {
			expect(err).toBeNull();
			asyncSpecDone();
		});
		asyncSpecWait();
	});

	describe('when it is retrieved from the database', function() {

		var retrievedCustomer = null;

		beforeEach(function() {
			Customer.findById(customer.id, function(err, result) {
				expect(err).toBeNull();
				retrievedCustomer = result;
				asyncSpecDone();
			});
			asyncSpecWait();
		});
	
		it('should contain the same values that have been inserted', function() {
			helper.customersShouldBeEqual(retrievedCustomer, customer);
		});
		
	});
	
	describe('when it is modified and updated', function() {
			
		beforeEach(function() {	
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
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('contains the updated values in the database', function() {
			Customer.findById(customer.id, function(err, result) {
				helper.customersShouldBeEqual(result, customer);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

	describe('when it is deleted', function() {
		
		beforeEach(function() {
			customer.remove(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});		

		it('can no longer be retrieved', function() {
			Customer.findById(customer.id, function(err, result) {
				expect(result).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});
	
});
