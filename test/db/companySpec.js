var mongoose = require('mongoose'),
	Company = require('../../lib/entities').Company,
	CompanyBuilder = require('../builders/company_builder.js'),
	should = require('should'),
	validationHelper = require('./mongoose_validation_helper.js'),
	equalityHelper = require('../equality_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('companies').drop();

describe('given a new company', function() {
	
	var company = null,
		error = null;
	
	beforeEach(function() {
		company = new CompanyBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {
		
		beforeEach(function(done) {
			company = new Company(); // the company reference by default points to a properly filled in instance
			company.save(function(err) {
				error = err;
				done();
			});
		});

		it('should fail with validation errors for each required field', function() {
			should.exist(error);
			validationHelper.checkRequiredValidationErrorFor(error, 'name');
			validationHelper.checkRequiredValidationErrorFor(error, 'address.street');
			validationHelper.checkRequiredValidationErrorFor(error, 'address.postalCode');
			validationHelper.checkRequiredValidationErrorFor(error, 'address.city');
			validationHelper.checkRequiredValidationErrorFor(error, 'phoneNumber');
			validationHelper.checkRequiredValidationErrorFor(error, 'email');
			validationHelper.checkRequiredValidationErrorFor(error, 'vatNumber');
			validationHelper.checkRequiredValidationErrorFor(error, 'bankAccount');
			validationHelper.checkRequiredValidationErrorFor(error, 'iban');
			validationHelper.checkRequiredValidationErrorFor(error, 'bic');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function(done) {
			company.save(function(err) {
				error = err;
				done();
			});
		});

		it('should not fail', function() {
			should.not.exist(error);
		});

	});

});

describe('given an existing company', function() {

	var company = null;

	beforeEach(function(done) {
		company = new CompanyBuilder().build();
		company.save(function(err) {
			should.not.exist(err);
			done();
		});
	});
	
	describe('when it is retrieved from the database', function() {
		
		var retrievedCompany = null;

		beforeEach(function(done) {
			Company.findById(company.id, function(err, result) {
				should.not.exist(err);
				retrievedCompany = result;
				done();
			});
		});

		it('should contain the same values that have been inserted', function() {
			equalityHelper.companiesShouldBeEqual(retrievedCompany, company);
		});

	});

	describe('when it is modified and updated', function() {
		
		beforeEach(function(done) {
			company.name = 'some other company';
			company.address = {
				street: 'some other street',
				postalCode: '12345',
				city: 'some other city',
				country: 'some other country'
			};
			company.phoneNumber = '987654321';
			company.email = 'ssdfadjf@d;kfj.com';
			company.vatNumber = '111111';
			company.bankAccount = '222222';
			company.iban = '87654';
			company.bic = 'bic';

			company.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('contains the updated values in the database', function(done) {
			Company.findById(company.id, function(err, result) {
				equalityHelper.companiesShouldBeEqual(result, company);
				done();
			});
		});

	});

	describe('when it is deleted', function() {
		
		beforeEach(function(done) {
			company.remove(function(err) {
				should.not.exist(err);
				done();
			});
		});		

		it('can no longer be retrieved', function(done) {
			Company.findById(company.id, function(err, result) {
				should.not.exist(result);
				done();
			});
		});

	});

});
