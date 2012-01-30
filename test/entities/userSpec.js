var User = require('../../lib/entities').User,
	should = require('should');

describe('given a user', function() {
	
	var user = null;

	beforeEach(function() {
		user = new User();
	});

	it('should have a default salt value', function() {
		should.exist(user.salt);
	});

	describe('when you create another user', function() {
		var user2 = null;

		beforeEach(function() {
			user2 = new User();
		});

		it('should not have the same salt value as the previous user', function() {
			user.salt.should.not.equal(user2.salt);
		});

	});

	describe('when you set the password', function() {

		beforeEach(function() {
			user.setPassword('my_password');
		});

		it('should not contain the password value in passwdHash', function() {
			user.passwdHash.should.not.equal('my_password');
		});

		describe('when you validate the password with the correct value', function() {

			it('should return true', function() {
				user.validatePassword('my_password').should.be.true;
			});			

		});

		describe('when you validate the password with an invalid value', function() {
			
			it('should return false', function() {
				user.validatePassword('something_else').should.be.false;
			});

		});

	});

});
