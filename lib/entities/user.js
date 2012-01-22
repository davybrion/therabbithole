var mongoose = require('mongoose'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	name: { type: String, required: true, unique: true },
	email: { type: String, required: true },
	salt: { type: String, required: true, default: uuid.v1 },
	passwdHash: { type: String, required: true }
});

var hash = function(passwd, salt) {
	return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
};

userSchema.methods.setPassword = function(passwordString) {
	this.passwdHash = hash(passwordString, this.salt);
};

userSchema.methods.validatePassword = function(passwordString) {
	return this.passwdHash === hash(passwordString, this.salt);
};

mongoose.model('User', userSchema);
module.exports = mongoose.model('User');