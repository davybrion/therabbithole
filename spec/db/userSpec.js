var mongoose = require('mongoose'),
	User = require('../../lib/entities').User,
	UserBuilder = require('../builders/user_builder.js'),
	helper = require('../helper_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('users').drop();

describe('given a new user', function() {
	
	var user = null,
		error = null;
	
	beforeEach(function() {
		user = new UserBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {

		beforeEach(function() {
			user = new User(); // the user reference by default points to a properly filled in instance
			user.salt = null; // to avoid the default value
			user.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should fail with validation errors for each required field', function() {
			expect(error).not.toBeNull();
			expect(error).toHaveRequiredValidationErrorFor('name');
			expect(error).toHaveRequiredValidationErrorFor('email');
			expect(error).toHaveRequiredValidationErrorFor('salt');
			expect(error).toHaveRequiredValidationErrorFor('passwdHash');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function() {
			user.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		afterEach(function() {
			// there's a unique index on user.name, if we don't remove it after each spec, the next insert fails
			user.remove(function(err) {
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should not fail', function() {
			expect(error).toBeNull();
		});

	});

});

describe('given an existing user', function() {
	
	var user = null;

	beforeEach(function(err) {
		user = new UserBuilder().build();
		user.save(function(err) {
			expect(err).toBeNull();
			asyncSpecDone();
		});
		asyncSpecWait();
	});

	afterEach(function() {
		if (user.removed) { return; }
		user.remove(function(err) {
			asyncSpecDone();
		});
		asyncSpecWait();
	});

	describe('when it is retrieved from the database', function() {
		
		var retrievedUser = null;

		beforeEach(function() {
			User.findById(user.id, function(err, result) {
				expect(err).toBeNull();
				retrievedUser = result;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should contain the same values that have been inserted', function() {
			helper.usersShouldBeEqual(retrievedUser, user);
		});

	});

	describe('when it is modified and updated', function() {
		
		beforeEach(function() {
			user.name = "some user name";
			user.email = "some email";
			user.salt = "some salt value";
			user.passwdHash = "some passwd hash";

			user.save(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('contains the updated values in the database', function() {
			User.findById(user.id, function(err, result) {
				helper.usersShouldBeEqual(result, user);
				asyncSpecDone();
			});
			asyncSpecWait();
		});
	});

	describe('when it is deleted', function() {
		
		beforeEach(function() {
			user.remove(function(err) {
				user.removed = true; // HACK: to avoid double removal in afterEach of parent suite
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('can no longer be retrieved', function() {
			User.findById(user.id, function(err, result) {
				expect(result).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

});