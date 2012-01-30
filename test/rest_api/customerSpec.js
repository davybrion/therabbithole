var mongooseInit = require('../../lib/mongoose_init').connect('mongodb://localhost/therabbithole_test'),
	app = require('../../lib/app.js'),
	Customer = require('../../lib/entities/customer'),
	CustomerBuilder = require('../builders/customer_builder'),
	requesthelper = require('./request_helper'),
	entityhelper = require('./../equality_functions'),
	should = require('should'),
	response = null;

function handleResponse(err, res, done) {
	should.not.exist(err);
	response = res;
	done();
}

var auth = require('./auth_helper.js');

describe('post /customer', function() {

	beforeEach(function(done) {
		auth.post_login(done);
	});
	
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

		beforeEach(function(done) {
			requesthelper.post('/customer', customer, handleResponse, done);
		});

		afterEach(function(done) {
			Customer.remove({ _id: response.body._id}, function(err) {
				done();
			});
		});

		it('should have a statuscode of 201', function() {
			response.statusCode.should.equal(201);
		});

		it('should have the customer document in the response body', function() {
			response.body.name.should.equal(customer.name);
			entityhelper.addressesShouldBeEqual(response.body.address, customer.address);
			response.body.vatNumber.should.equal(customer.vatNumber);
		});		

		it('should have persisted the document in the database', function(done) {
			Customer.findById(response.body._id, function(err, result) {
				should.not.exist(err);
				result.id.should.equal(response.body._id);
				done();
			});
		});

		it('should contain a valid Location header value pointing to the new customer', function() {
			response.headers.location.should.equal('http://localhost:3000/customer/' + response.body._id)
		});

	});

	describe('when the request contains a customer document with missing required fields', function() {

		beforeEach(function(done) {
			requesthelper.post('/customer', { name: 'some name', vatNumber: '1234567890' }, handleResponse, done);
		});

		it('should have a statuscode of 500', function() {
			response.statusCode.should.equal(500);
		});

		it('should have an error message in the body', function() {
			response.body.should.equal('Validation failed');
		});
	});

	describe('when the request contains a customer document that already has an id value', function() {
		beforeEach(function(done) {
			requesthelper.post('/customer', {
				id: '4e53dd6773a37be113000001',
				name: 'some name',
				address: {
					street: 'some street',
					postalCode: '1234',
					city: 'some city'
				},
				vatNumber: '1234567890'
			}, handleResponse, done);
		});

		it('should have a statuscode of 412', function() {
			response.statusCode.should.equal(412);
		});

		it('should have an error message in the body', function() {
			response.body.should.equal('customer should not have an id value');
		});
	});

});

describe('get /customer/:id', function() {
	
	beforeEach(function(done) {
		auth.post_login(done);
	});

	describe('when the request contains an id of a non-existing customer', function() {

		beforeEach(function(done) {
			requesthelper.get('/customer/4e552df6c83e22b929999999', handleResponse, done);
		});

		it('should have a status code of 404', function() {
			response.statusCode.should.equal(404);
		});

	});

	describe('when the request contains an id of an existing customer', function() {
		
		var customer = null;
		
		beforeEach(function(done) {
			customer = new CustomerBuilder()
				.withContact({ name: 'some contact', email: 'some email' })
				.build();
			customer.save(function(err) {
				should.not.exist(err);
				requesthelper.get('/customer/' + customer.id, handleResponse, done);
			});
		});

		afterEach(function(done) {
			customer.remove(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should have a statusCode of 200', function() {
			response.statusCode.should.equal(200);
		});

		it('should have the customer document in the response body', function() {
			entityhelper.customersShouldBeEqual(customer, JSON.parse(response.body));
		});

	});

});