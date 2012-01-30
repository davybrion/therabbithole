var request = require('request');

function getUrlFor(route) {
	return 'http://localhost:3000' + route;
}

function sendRequest(method, route, body, callback, done) {
	request[method]({ url: getUrlFor(route), json: body }, function(err, res, b) {
		callback(err, res, done);
	});
}

module.exports = {
	post: function(route, body, callback, done) {
		sendRequest('post', route, body, callback, done);
	},

	get: function(route, callback, done) {
		sendRequest('get', route, null, callback, done);
	}
};