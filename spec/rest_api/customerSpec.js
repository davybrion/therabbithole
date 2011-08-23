var mongooseInit = require('../../lib/mongoose_init').connect('mongodb://localhost/therabbithole_test'),
	app = require('../../lib/app.js'),
	Customer = require('../../lib/entities/customer'),
	request = require('request'),
	http = require('http'),
	error = null,
	response = null,
	responseBody = null;

function getUrlFor(route) {
	return 'http://localhost:3000' + route;
}

function post(route, body) {
	request.post({ url: getUrlFor(route), json: body }, function(err, res, body) {
		error = err;
		response = res;
		responseBody = body;
		asyncSpecDone();
	});
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

		it('should not cause any errors', function() {
			expect(error).toBeNull();
		});

		it('should return 201 with the customer document', function() {
			expect(response.statusCode).toBe(201);
			expect(response.body).not.toBeNull();
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
});