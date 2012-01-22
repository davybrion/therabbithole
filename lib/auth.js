var User = require('./entities/User');

var authenticate = function(username, password, callback) {
	User.findOne({ name: username }, function(err, user) {
		if (err) return callback(new Error('User not found'));
		if (user.validatePassword(password)) return callback(null, user);
		return callback(new Error('Invalid password'));
	});
};

var restrict = function(req, res, next) {
	if (req.session.username) {
		next();	
	} else {
		req.session.error = "access denied";
		res.redirect('/login');
	}
};

module.exports = function(app) {
	
	app.get('/logout', function(req, res) {
		req.session.destroy(function() {
			res.redirect('/login');
		});
	});

	app.get('/login', function(req, res) {
		if (req.session && req.session.username) {
			res.redirect('/');	
		} else {
			res.render('login');
		}
	});

	app.post('/login', function(req, res) {
		authenticate(req.body.username, req.body.password, function(err, user) {
			if (user) {
				req.session.regenerate(function() {
					req.session.username = user.name;
					res.redirect('/');
				});	
			} else {
				req.session.error = "authentication failed";
				res.redirect('/login');
			}
		});
	});

	return restrict;
};