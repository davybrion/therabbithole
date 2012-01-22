var User = require('../../lib/entities').User;

describe('given a user', function() {
	
	var user = null;

	beforeEach(function() {
		user = new User();
	});

	it('should have a default salt value', function() {
		expect(user.salt).not.toBe(null);
	});

	describe('when you create another user', function() {
		var user2 = null;

		beforeEach(function() {
			user2 = new User();
		});

		it('should not have the same salt value as the previous user', function() {
			expect(user.salt).not.toEqual(user2.salt);
		});

	});

	describe('when you set the password', function() {

		beforeEach(function() {
			user.setPassword('my_password');
		});

		it('should not contain the password value in passwdHash', function() {
			expect(user.passwdHash).not.toEqual('my_password');
		});

		describe('when you validate the password with the correct value', function() {

			it('should return true', function() {
				expect(user.validatePassword('my_password')).toBe(true);
			});			

		});

		describe('when you validate the password with an invalid value', function() {
			
			it('should return false', function() {
				expect(user.validatePassword('something_else')).toBe(false);
			});

		});

	});

});
