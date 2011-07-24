var mongoose = require('mongoose'),
	Customer = require('../../lib/entities.js').Customer,
	CustomerBuilder = require('../builders/customer_builder.js'),
	helper = require('../helper_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('customers').drop();

describe('given a new customer', function() {

	describe('when it is saved with none of its required fields filled in', function() {

		it('should fail with validation errors for each required field', function() {
			var customer = new Customer();
			customer.save(function(err) {
				expect(err).not.toBeNull();
				expect(err).toHaveRequiredValidationErrorFor('name');
				expect(err).toHaveRequiredValidationErrorFor('vatNumber');
				expect(err).toHaveRequiredValidationErrorFor('address.street');
				expect(err).toHaveRequiredValidationErrorFor('address.postalCode');
				expect(err).toHaveRequiredValidationErrorFor('address.city');
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {

		it('should not fail', function() {
			var customer = new CustomerBuilder().build();
			customer.save(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should contain a default false value for includeContactOnInvoice', function() {
			var customer = new CustomerBuilder().build();
			customer.save(function(err) {
				Customer.findById(customer.id, function(err, result) {
					expect(result.includeContactOnInvoice).toBe(false);
					asyncSpecDone();
				});
			});
			asyncSpecWait();
		});

	});

});

describe('given an existing customer', function() {
	
	describe('when it is retrieved from the database', function() {
	
		it('should contain the same values that have been inserted', function() {
			var customer = new CustomerBuilder()
				.withAddress({ street: 'some street', city: 'some city', postalCode: '1234', country: 'some country' })
				.withPhoneNumber('123456789')
				.withContact({ name: 'some name', email: 'some.email@gmail.com' })
				.withIncludeContactOnInvoice()
				.build();
			
			customer.save(function(err) {
				Customer.findById(customer.id, function(err, result) {
					helper.customersShouldBeEqual(result, customer);					
					asyncSpecDone();
				});
			});
			asyncSpecWait();
		});
		
	});
	
});
