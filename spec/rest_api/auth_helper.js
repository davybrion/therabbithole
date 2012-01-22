var	User = require('../../lib/entities/user'),
	request_helper = require('./request_helper');


var user = new User({
	name: 'test_user',
	email: 'blah'
});
user.setPassword('test');

user.save(function(err, result) {
	request_helper.post('/login', {
		username: user.name,
		password: 'test'
	}, function(err, result) {
		if (err) throw err;
	});	
});

