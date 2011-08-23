var Customer = require('../entities/Customer');

module.exports = function(app){

	app.get('/customer/:id', function(req, res, next) {
		var customer = Customer.findById(req.params.id, function(err, customer) {
			if (err) { return next(err); }
			res.json(customer, 200);
		});
	});

	app.post('/customer', function(req, res, next) {
		if (req.body.customer.id) {
			// TODO: review whether this http status code really makes sense
			res.send('customer should not have an id value', 412);
			return;
		}

		var newCustomer = new Customer(req.body.customer);

		newCustomer.save(function(err, result) {
			if (err) {
				// TODO: get a generic logger wich returns an id that can be used to lookup the real error
				res.send('oops (temporary message)', 500);	
			}

			// TODO: should this really return the full customer?
			res.json(result, 201);
		});
	});
};