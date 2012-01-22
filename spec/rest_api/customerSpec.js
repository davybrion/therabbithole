var mongooseInit = require('../../lib/mongoose_init').connect('mongodb://localhost/therabbithole_test'),
	app = require('../../lib/app.js'),
	Customer = require('../../lib/entities/customer'),
	CustomerBuilder = require('../builders/customer_builder'),
	requesthelper = require('./request_helper'),
	entityhelper = require('./../helper_functions'),
	response = null;

function handleResponse(err, res) {
	expect(err).toBeNull();
	response = res;
	asyncSpecDone();
}

require('./auth_helper.js');

describe('post /customer', function() {
	
	describe('when the request contains a customer document with all required fields provided', function() {

		var customer = {
			name: 'some name',
			address: {
				street: 'some street',
				postalCode: '1234',
				city: 'some city'
			},
			vatNumber: '1234567890'
		}; 

		beforeEach(function() {
			requesthelper.post('/customer', customer, handleResponse);
			asyncSpecWait();
		});

		afterEach(function() {
			Customer.remove({ _id: response.body._id}, function(err) {
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should have a statuscode of 201', function() {
			expect(response.statusCode).toBe(201);
		});

		it('should have the customer document in the response body', function() {
			expect(response.body.name).toEqual(customer.name);
			expect(response.body.address).toEqual(customer.address);
			expect(response.body.vatNumber).toEqual(customer.vatNumber);
		});		

		it('should have persisted the document in the database', function() {
			Customer.findById(response.body._id, function(err, result) {
				expect(err).toBeNull();
				expect(result.id).toEqual(response.body._id);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should contain a valid Location header value pointing to the new customer', function() {
			expect(response.headers.location).toBe('http://localhost:3000/customer/' + response.body._id);
		});

	});

	describe('when the request contains a customer document with missing required fields', function() {

		beforeEach(function() {
			post('/customer', { name: 'some name', vatNumber: '1234567890' }, handleResponse);
			asyncSpecWait();
		});

		it('should have a statuscode of 500', function() {
			expect(response.statusCode).toBe(500);
		});

		it('should have an error message in the body', function() {
			expect(response.body).toEqual('Validation failed');
		});
	});

	describe('when the request contains a customer document that already has an id value', function() {
		beforeEach(function() {
			post('/customer', {
				id: '4e53dd6773a37be113000001',
				name: 'some name',
				address: {
					street: 'some street',
					postalCode: '1234',
					city: 'some city'
				},
				vatNumber: '1234567890'
			}, handleResponse);
			asyncSpecWait();
		});

		it('should have a statuscode of 412', function() {
			expect(response.statusCode).toBe(412);
		});

		it('should have an error message in the body', function() {
			expect(response.body).toEqual('customer should not have an id value');
		});
	});

});

describe('get /customer/:id', function() {
	
	describe('when the request contains an id of a non-existing customer', function() {

		beforeEach(function() {
			requesthelper.get('/customer/4e552df6c83e22b929999999', handleResponse);
			asyncSpecWait();
		});

		it('should have a status code of 404', function() {
			expect(response.statusCode).toBe(404);
		});

	});

	describe('when the request contains an id of an existing customer', function() {
		
		var customer = null;
		
		beforeEach(function() {
			customer = new CustomerBuilder()
				.withContact({ name: 'some contact', email: 'some email' })
				.build();
			customer.save(function(err) {
				expect(err).toBeNull();
				requesthelper.get('/customer/' + customer.id, handleResponse);
			});
			asyncSpecWait();
		});

		afterEach(function() {
			customer.remove(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should have a statusCode of 200', function() {
			expect(response.statusCode).toBe(200);
		});

		it('should have the customer document in the response body', function() {
			entityhelper.customersShouldBeEqual(customer, JSON.parse(response.body));
		});

	});

});