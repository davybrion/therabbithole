var Customer = require('../entities/Customer');

module.exports = function(app){

	app.get('/customer/create', function(req, res) {
		res.render('customer/create');
	});

	app.post('/customer', function(req, res, next) {
		var newCustomer = new Customer(req.body.customer);
		newCustomer.save(function(err, result) {
			if (err) {
				return next(err);
			}

			req.flash('info', 'customer with id ' + result.id + ' created');
			res.redirect('/');
		});
	});

};