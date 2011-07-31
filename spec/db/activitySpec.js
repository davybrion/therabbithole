var mongoose = require('mongoose'),
	Activity = require('../../lib/entities').Activity,
	ActivityBuilder = require('../builders/activity_builder.js'),
	helper = require('../helper_functions.js');
	
mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('activities').drop();

describe('given a new activity', function() {
	
	var activity = null,
		error = null;

	beforeEach(function() {
		activity = new ActivityBuilder().build();
	});

	describe('when it is saved with none of its required fields filled in', function() {
		
		beforeEach(function() {
			activity = new Activity(); // the activity reference by default points to a properly filled in instance
			activity.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should fail with validation errors for each required field', function() {
			expect(error).not.toBeNull();
			expect(error).toHaveRequiredValidationErrorFor('customer');
			expect(error).toHaveRequiredValidationErrorFor('description');
			expect(error).toHaveRequiredValidationErrorFor('hourlyRate');
		});
		
	});

	describe('when it is saved with all of its required fields filled in', function() {
		
		beforeEach(function() {
			activity.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should not fail', function() {
			expect(error).toBeNull();
		});

		it('should contain a default false value for billed', function() {
			Activity.findById(activity.id, function(err, result) {
				expect(result.billed).toBe(false);
				asyncSpecDone();
			});
			asyncSpecWait();
		});
		
	});

	describe('when it is saved with valid performed work added to it', function() {

		var today = new Date();
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() -1);

		beforeEach(function() {
			activity.addPerformedWork(yesterday, 8);
			activity.addPerformedWork(today, 6);
			activity.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should not cause validation errors', function() {
			expect(error).toBeNull();
		});

		it('the performed work should be inserted in the database as well', function() {
			Activity.findById(activity.id, function(err, result) {
				expect(result.performedWork.length).toBe(2);
				expect(result.performedWork[0].date).toEqual(yesterday);
				expect(result.performedWork[0].hours).toEqual(8);
				expect(result.performedWork[1].date).toEqual(today);
				expect(result.performedWork[1].hours).toEqual(6);
				asyncSpecDone();
			});
			asyncSpecWait();
		});
		
	});
	
	describe('when it is saved with too much performed work added to it', function() {
		
		beforeEach(function() {
			activity.addPerformedWork(new Date(), 17); // max value is set at 16;
			activity.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should cause a max value validation error if the number of hours is too large', function() {
			expect(error).toHaveMaxValidationErrorFor('hours');
		});

	});

	describe('when it is saved with too little performed work added to it', function() {
		
		beforeEach(function() {
			activity.addPerformedWork(new Date(), 0); // min value is 1
			activity.save(function(err) {
				error = err;
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should cause a min value validation error if the number of hours is too small', function() {
			expect(error).toHaveMinValidationErrorFor('hours');
		});

	});

});

describe('given an existing activity', function() {

	var activity = null;

	beforeEach(function() {
		activity = new ActivityBuilder()
			.asBilled()
			.build();
		activity.save(function(err) {
			expect(err).toBeNull();
			asyncSpecDone();
		});
		asyncSpecWait();
	});

	describe('when it is retrieved from the database', function() {

		var retrievedActivity = null;

		beforeEach(function() {
			Activity.findById(activity.id, function(err, result) {
				expect(err).toBeNull();
				retrievedActivity = result;
				asyncSpecDone();
			});
			asyncSpecWait();
		});
		
		it('should contain the same values that have been inserted', function() {
			helper.activitiesShouldBeEqual(retrievedActivity, activity);
		});
		
	});

	describe('when it is modified and updated', function() {
			
		beforeEach(function() {
			activity.customer = '4e25937456436de850000007';
			activity.description = 'some other cool project';
			activity.hourlyRate = 77;
			activity.billed = false;
			activity.performedWork = [];
			activity.save(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('contains the updated values in the database', function() {
			Activity.findById(activity.id, function(err, result) {
				helper.activitiesShouldBeEqual(result, activity);
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});

	describe('when it is deleted', function() {
		
		beforeEach(function() {
			activity.remove(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});		

		it('can no longer be retrieved', function() {
			Activity.findById(activity.id, function(err, result) {
				expect(result).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

	});
	
});
