var Customer = require('../entities/Customer');

module.exports = function(app){

	app.get('/customer/create', function(req, res) {
		res.render('customer/create');
	});

	app.get('/customer/list', function(req, res, next) {
		var customers = Customer.find({}, [ 'name' ], function(err, docs) {
			if (err) { return next(err); }
			console.log(docs);
			res.render('customer/list', { customers: docs });
		});
	});

	app.get('/customer/:id', function(req, res, next) {
		var customer = Customer.findById(req.params.id, function(err, customer) {
			if (err) { return next(err); };
			res.send(customer);
		});
	});

	app.post('/customer', function(req, res, next) {
		var newCustomer = new Customer(req.body.customer);
		newCustomer.save(function(err, result) {
			if (err) { return next(err); }
			req.flash('info', 'customer with id ' + result.id + ' created');
			res.redirect('/');
		});
	});

};