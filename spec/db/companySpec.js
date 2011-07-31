var mongoose = require('mongoose'),
	Company = require('../../lib/entities').Company,
	CompanyBuilder = require('../builders/company_builder.js'),
	helper = require('../helper_functions.js');

mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('companies').drop();

describe('given a new company', function() {
	
	var company = null,
		error = null;
	
	beforeEach(function() {
		company = new CompanyBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {
		
		beforeEach(function() {
			company = new Company(); // the company reference by default points to a properly filled in instance
			company.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should fail with validation errors for each required field', function() {
			expect(error).not.toBeNull();
			expect(error).toHaveRequiredValidationErrorFor('name');
			expect(error).toHaveRequiredValidationErrorFor('address.street');
			expect(error).toHaveRequiredValidationErrorFor('address.postalCode');
			expect(error).toHaveRequiredValidationErrorFor('address.city');
			expect(error).toHaveRequiredValidationErrorFor('phoneNumber');
			expect(error).toHaveRequiredValidationErrorFor('email');
			expect(error).toHaveRequiredValidationErrorFor('vatNumber');
			expect(error).toHaveRequiredValidationErrorFor('bankAccount');
			expect(error).toHaveRequiredValidationErrorFor('iban');
			expect(error).toHaveRequiredValidationErrorFor('bic');
		});

	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function() {
			company.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should not fail', function() {
			expect(error).toBeNull();
		});

	});

});

describe('given an existing company', function() {

	var company = null;

	beforeEach(function() {
		company = new CompanyBuilder().build();
		company.save(function(err) {
			expect(err).toBeNull();
			asyncSpecDone();
		});
		asyncSpecWait();
	});
	
	describe('when it is retrieved from the database', function() {
		
		var retrievedCompany = null;

		beforeEach(function() {
			Company.findById(company.id, function(err, result) {
				expect(err).toBeNull();
				retrievedCompany = result;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should contain the same values that have been inserted', function() {
			helper.companiesShouldBeEqual(retrievedCompany, company);
		});

	});

	describe('when it is modified and updated', function() {
		
		beforeEach(function() {
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
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('contains the updated values in the database', function() {
			Company.findById(company.id, function(err, result) {
				helper.companiesShouldBeEqual(result, company);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

	describe('when it is deleted', function() {
		
		beforeEach(function() {
			company.remove(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});		

		it('can no longer be retrieved', function() {
			Company.findById(company.id, function(err, result) {
				expect(result).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

});
