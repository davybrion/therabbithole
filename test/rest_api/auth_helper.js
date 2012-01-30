var	User = require('../../lib/entities/user'),
	mongoose = require('mongoose'),
	request_helper = require('./request_helper');

mongoose.connection.collection('users').drop();

var user = new User({
	name: 'test_user',
	email: 'blah'
});
user.setPassword('test');

user.save(function(err, result) {
	if (err) throw err;
});

exports.post_login = function(done) {
	request_helper.post('/login', {
		username: user.name,
		password: 'test'
	}, function(err, result, done) {
		if (err) throw err;
		done();
	}, done);		
};
