var express = require('express'),
	mongoose = require('mongoose'),
	app = module.exports = express.createServer();

mongoose.connect('mongodb://localhost/therabbithole');

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.register('.html', require('ejs'));

app.dynamicHelpers({
	messages: require('express-messages'),
	page: function() {
		return {};
	},
	script: function(req){
		req._scripts = [];
		return function(path){
			req._scripts.push(path);
		};
	},
	scripts: function(req){
		return req._scripts;
	}
});

app.configure(function(){
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'really obscure secret' }));
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

require('./routes/customer')(app);

app.get('/', function(req, res){
	res.render('index');
});

app.listen(3000);
console.log('Express started on port 3000');