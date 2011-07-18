var mongoose = require('mongoose'),
	Customer = require('../../lib/entities.js').Customer,
	CustomerBuilder = require('../builders/customer_builder.js'),
	helper = require('../helper_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('customers').drop();

describe('when a customer is saved', function() {
	describe('with none of its required fields filled in', function() {
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

	describe('with all of its required fields filled in', function() {
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
	
	describe('with all fields filled in', function() {
		it('should have the same values when retrieved again', function() {
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

mongoose.connection.collection('customers').drop();	
