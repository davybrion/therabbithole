var Customer = require('../entities/Customer');

module.exports = function(app){

	app.get('/customer/:id', function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if (err) { return next(err); }

			if (!customer) {
				// TODO: better message?
				res.send('customer not found', 404);
				return;
			}

			res.json(customer, 200);
		});
	});

	app.post('/customer', function(req, res, next) {
		if (req.body.id) {
			res.send('customer should not have an id value', 412);
			return;
		}

		var newCustomer = new Customer(req.body);

		newCustomer.save(function(err, result) {
			if (err) {
				// TODO: send a full message?
				res.send(err.message, 500);
				return;	
			}

			// TODO: find a way to determine whether we're using http or https automatically
			var location = 'http://' + req.headers.host + '/customer/' + result.id;
			res.header('location', location);
			res.json(result, 201);
		});
	});
};