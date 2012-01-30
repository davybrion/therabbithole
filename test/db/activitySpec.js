var mongoose = require('mongoose'),
	Activity = require('../../lib/entities').Activity,
	Customer = require('../../lib/entities').Customer,
	ActivityBuilder = require('../builders/activity_builder.js'),
	CustomerBuilder = require('../builders/customer_builder.js'),
	mongooseTestHelper = require('./persistence_spec_functions.js'),
	validationHelper = require('./mongoose_validation_helper.js'),
	equalityHelper = require('../equality_functions.js'),
	should = require('should');
	
mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('activities').drop();

describe('given a new activity', function() {
	
	var activity = null,
		error = null;

	beforeEach(function() {
		activity = new ActivityBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {
		
		beforeEach(function(done) {
			activity = new Activity(); // the activity reference by default points to a properly filled in instance
			activity.save(function(err) {
				error = err;
				done();
			});
		});

		it('should fail with validation errors for each required field', function() {
			should.exist(error);
			validationHelper.checkRequiredValidationErrorFor(error, 'customer');
			validationHelper.checkRequiredValidationErrorFor(error, 'description');
			validationHelper.checkRequiredValidationErrorFor(error, 'hourlyRate');
		});
		
	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function(done) {
			activity.save(function(err) {
				error = err;
				done();
			});
		});

		it('should not fail', function() {
			should.not.exist(error);
		});

		it('should contain a default false value for billed', function(done) {
			Activity.findById(activity.id, function(err, result) {
				result.billed.should.be.false;
				done();
			});
		});
		
	});

	describe('when it is saved with valid performed work added to it', function() {

		var today = new Date(),
			yesterday = new Date();
		yesterday.setDate(yesterday.getDate() -1);

		beforeEach(function(done) {
			activity.addPerformedWork(yesterday, 8);
			activity.addPerformedWork(today, 6);
			activity.save(function(err) {
				error = err;
				done();
			});
		});

		it('should not cause validation errors', function() {
			should.not.exist(error);
		});

		it('the performed work should be inserted in the database as well', function(done) {
			Activity.findById(activity.id, function(err, result) {
				result.performedWork.length.should.equal(2);
				result.performedWork[0].date.valueOf().should.equal(yesterday.valueOf());
				result.performedWork[0].hours.valueOf().should.equal(8);
				result.performedWork[1].date.valueOf().should.equal(today.valueOf());
				result.performedWork[1].hours.valueOf().should.equal(6);
				done();
			});
		});
		
	});
	
	describe('when it is saved with too much performed work added to it', function() {
		
		beforeEach(function(done) {
			activity.addPerformedWork(new Date(), 17); // max value is set at 16;
			activity.save(function(err) {
				error = err;
				done();
			});
		});

		it('should cause a max value validation error if the number of hours is too large', function() {
			validationHelper.checkMaxValidationErrorFor('hours');
		});

	});

	describe('when it is saved with too little performed work added to it', function() {
		
		beforeEach(function(done) {
			activity.addPerformedWork(new Date(), 0); // min value is 1
			activity.save(function(err) {
				error = err;
				done();
			});
		});

		it('should cause a min value validation error if the number of hours is too small', function() {
			validationHelper.checkMinValidationErrorFor('hours');
		});

	});

	mongooseTestHelper.create_entity_with_reference_and_check_populate({
		buildReferenceEntityFn: function() { 
			return new CustomerBuilder().build(); 
		},
		referenceName: 'customer',
		entityName: 'activity',
		getEntityFn: function() {
			return activity;
		},
		entityModel: Activity,
		equalityFn: equalityHelper.customersShouldBeEqual
	});

});

describe('given an existing activity', function() {

	var activity = null;

	beforeEach(function(done) {
		activity = new ActivityBuilder()
			.asBilled()
			.build();
		activity.save(function(err) {
			should.not.exist(err);
			done();
		});
	});

	describe('when it is retrieved from the database', function() {

		var retrievedActivity = null;

		beforeEach(function(done) {
			Activity.findById(activity.id, function(err, result) {
				should.not.exist(err);
				retrievedActivity = result;
				done();
			});
		});
		
		it('should contain the same values that have been inserted', function() {
			equalityHelper.activitiesShouldBeEqual(retrievedActivity, activity);
		});
		
	});

	describe('when it is modified and updated', function() {
			
		beforeEach(function(done) {
			activity.customer = '4e25937456436de850000007';
			activity.description = 'some other cool project';
			activity.hourlyRate = 77;
			activity.billed = false;
			activity.performedWork = [];
			activity.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('contains the updated values in the database', function(done) {
			Activity.findById(activity.id, function(err, result) {
				equalityHelper.activitiesShouldBeEqual(result, activity);
				done();
			});
		});

	});

	describe('when it is deleted', function() {
		
		beforeEach(function(done) {
			activity.remove(function(err) {
				should.not.exist(err);
				done();
			});
		});		

		it('can no longer be retrieved', function(done) {
			Activity.findById(activity.id, function(err, result) {
				should.not.exist(result);
				done();
			});
		});

	});
	
});
