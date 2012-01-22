var express = require('express'),
	mongooseInit = require('./mongoose_init'),
	app = module.exports = express.createServer();

mongooseInit.connect();

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

var restrict = require('./auth.js')(app);
require('./routes/customer')(app, restrict);
require('./rest_api/customer')(app, restrict);

app.get('/', restrict, function(req, res){
	res.render('index');
});

app.listen(3000);
console.log('Express started on port 3000');