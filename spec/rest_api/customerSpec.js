var mongooseInit = require('../../lib/mongoose_init').connect('mongodb://localhost/therabbithole_test'),
	app = require('../../lib/app.js'),
	Customer = require('../../lib/entities/customer'),
	request = require('request'),
	http = require('http'),
	response = null;

function getUrlFor(route) {
	return 'http://localhost:3000' + route;
}

function sendRequest(method, route, body) {
	request[method]({ url: getUrlFor(route), json: body }, function(err, res) {
		expect(err).toBeNull();
		response = res;
		asyncSpecDone();
	});
}

function post(route, body) {
	sendRequest('post', route, body);
}

describe('post /customer', function() {
	
	describe('when the request contains a customer document with all required fields provided', function() {

		beforeEach(function() {
			post('/customer', {
				customer: {
					name: 'some name',
					address: {
						street: 'some street',
						postalCode: '1234',
						city: 'some city'
					},
					vatNumber: '1234567890'
				}
			});
			asyncSpecWait();
		});

		afterEach(function() {
			Customer.remove({ _id: response.body._id}, function(err) {
				if (err) { console.log(err); }
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should return 201 with the customer document', function() {
			expect(response.statusCode).toBe(201);
			expect(response.body.name).toBe('some name');
			expect(response.body._id).toBeDefined();
			expect(response.body._id).not.toBeNull();
		});		

		it('should have persisted the document in the database', function() {
			Customer.findById(response.body._id, function(err, result) {
				expect(err).toBeNull();
				expect(result.id).toEqual(response.body._id);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

	describe('when the request contains a customer document with missing required fields', function() {

		beforeEach(function() {
			post('/customer', {
				customer: {
					name: 'some name',
					vatNumber: '1234567890'
				}
			});
			asyncSpecWait();
		});

		it('should return 500 with an error message', function() {
			expect(response.statusCode).toBe(500);
			expect(response.body).toEqual('Validation failed');
		});
	});

});