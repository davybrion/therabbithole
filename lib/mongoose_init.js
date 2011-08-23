var mongoose = require('mongoose');

module.exports = (function() {

	var connected = false;

	return {
		connect: function(connectionString) {
			if (!connected) {
				connectionString = connectionString || 'mongodb://localhost/therabbithole';
				mongoose.connect(connectionString);
				connected = true;	
			}
		}
	};
}());