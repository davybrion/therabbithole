var request = require('request');

function getUrlFor(route) {
	return 'http://localhost:3000' + route;
}

function sendRequest(method, route, body, callback) {
	request[method]({ url: getUrlFor(route), json: body }, function(err, res, b) {
		callback(err, res);
	});
}

module.exports = {
	post: function(route, body, callback) {
		sendRequest('post', route, body, callback);
	},

	get: function(route, callback) {
		sendRequest('get', route, null, callback);
	}
};