var mongoose = require('mongoose'),
	Customer = require('../../lib/entities.js').Customer,
	CustomerBuilder = require('../builders/customer_builder.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('customers').drop();

describe('when a customer is saved', function() {
	it('should fail with validation errors if required fields are missing', function() {
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
	
	it('should not cause errors if all required fields are filled in', function() {
		var customer = new CustomerBuilder().build();
		customer.save(function(err) {
			expect(err).toBeNull();
			asyncSpecDone();
		})
		asyncSpecWait();
	});
});

mongoose.connection.collection('customers').drop();	
