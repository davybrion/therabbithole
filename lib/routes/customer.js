var Customer = require('../entities/Customer');

module.exports = function(app){

	app.get('/customer/create', function(req, res) {
		res.render('customer/create');
	});

	app.get('/customer/list', function(req, res, next) {
		var customers = Customer.find({}, [ 'name' ], function(err, docs) {
			if (err) { return next(err); }
			res.render('customer/list', { customers: docs });
		});
	});

};