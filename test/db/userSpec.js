var mongoose = require('mongoose'),
	User = require('../../lib/entities').User,
	UserBuilder = require('../builders/user_builder.js'),
	should = require('should'),
	validationHelper = require('./mongoose_validation_helper.js'),
	equalityHelper = require('../equality_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('users').drop();

describe('given a new user', function() {
	
	var user = null,
		error = null;
	
	beforeEach(function() {
		user = new UserBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {

		beforeEach(function(done) {
			user = new User(); // the user reference by default points to a properly filled in instance
			user.salt = null; // to avoid the default value
			user.save(function(err) {
				error = err;
				done();
			});
		});

		it('should fail with validation errors for each required field', function() {
			should.exist(error);
			validationHelper.checkRequiredValidationErrorFor(error, 'name');
			validationHelper.checkRequiredValidationErrorFor(error, 'email');
			validationHelper.checkRequiredValidationErrorFor(error, 'salt');
			validationHelper.checkRequiredValidationErrorFor(error, 'passwdHash');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function(done) {
			user.save(function(err) {
				error = err;
				done();
			});
		});

		afterEach(function(done) {
			// there's a unique index on user.name, if we don't remove it after each spec, the next insert fails
			user.remove(function(err) {
				done();
			});
		});

		it('should not fail', function() {
			should.not.exist(error);
		});

	});

});

describe('given an existing user', function() {
	
	var user = null;

	beforeEach(function(done) {
		user = new UserBuilder().build();
		user.save(function(err) {
			should.not.exist(err);
			done();
		});
	});

	afterEach(function(done) {
		if (user.removed) { done(); }
		user.remove(function(err) {
			done();
		});
	});

	describe('when it is retrieved from the database', function() {
		
		var retrievedUser = null;

		beforeEach(function(done) {
			User.findById(user.id, function(err, result) {
				should.not.exist(err);
				retrievedUser = result;
				done();
			});
		});

		it('should contain the same values that have been inserted', function() {
			equalityHelper.usersShouldBeEqual(retrievedUser, user);
		});

	});

	describe('when it is modified and updated', function() {
		
		beforeEach(function(done) {
			user.name = "some user name";
			user.email = "some email";
			user.salt = "some salt value";
			user.passwdHash = "some passwd hash";

			user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('contains the updated values in the database', function(done) {
			User.findById(user.id, function(err, result) {
				equalityHelper.usersShouldBeEqual(result, user);
				done();
			});
		});
	});

	describe('when it is deleted', function() {
		
		beforeEach(function(done) {
			user.remove(function(err) {
				user.removed = true; // HACK: to avoid double removal in afterEach of parent suite
				should.not.exist(err);
				done();
			});
		});

		it('can no longer be retrieved', function(done) {
			User.findById(user.id, function(err, result) {
				should.not.exist(result);
				done();
			});
		});

	});

});