var mongoose = require('mongoose'),
	Activity = require('../../lib/entities.js').Activity,
	ActivityBuilder = require('../builders/activity_builder.js'),
	helper = require('../helper_functions.js');
	
mongoose.connect('mongodb://localhost/therabbithole_test');
mongoose.connection.collection('activities').drop();

describe('when an activity is saved', function() {
	describe('with none of its required fields filled in', function() {
		it('should fail with validation errors for each required field', function() {
			var activity = new Activity();
			activity.save(function(err) {
				expect(err).not.toBeNull();
				expect(err).toHaveRequiredValidationErrorFor('customer');
				expect(err).toHaveRequiredValidationErrorFor('description');
				expect(err).toHaveRequiredValidationErrorFor('hourlyRate');
				asyncSpecDone();
			});
			asyncSpecWait();
		});
	});
	
	describe('with all of its required fields filled in', function() {
		it('should not fail', function() {
			var activity = new ActivityBuilder();
			activity = activity.build();
			activity.save(function(err) {
				expect(err).toBeNull();
				asyncSpecDone();
			});
			asyncSpecWait();
		});

		it('should contain a default false value for billed', function() {
			var activity = new ActivityBuilder().build();
			activity.save(function(err) {
				Activity.findById(activity.id, function(err, result) {
					expect(result.billed).toBe(false);
					asyncSpecDone();
				});
			});
			asyncSpecWait();
		});
	});
	
	describe('with valid performed work added to it', function() {
		it('should be inserted as well', function() {
			var activity = new ActivityBuilder().build();
			var today = new Date();
			var yesterday = new Date();
			yesterday.setDate(yesterday.getDate() -1);
			activity.addPerformedWork(yesterday, 8);
			activity.addPerformedWork(today, 6);
			activity.save(function(err) {
				expect(err).toBeNull();
				Activity.findById(activity.id, function(err, result) {
					expect(result.performedWork.length).toBe(2);
					expect(result.performedWork[0].date).toEqual(yesterday);
					expect(result.performedWork[0].hours).toEqual(8);
					expect(result.performedWork[1].date).toEqual(today);
					expect(result.performedWork[1].hours).toEqual(6);
				});
				asyncSpecDone();
			});
			asyncSpecWait();
		});
	});
	
	describe('with invalid performed work added to it', function() {
		it('should cause a validation error', function() {
			var activity = new ActivityBuilder().build();
			activity.addPerformedWork(new Date(), 9); // max value is set at 8
			activity.save(function(err) {
				expect(err).not.toBeNull();
				expect(err).toHaveMaxValidationErrorFor('hours');
				asyncSpecDone();
			});
			asyncSpecWait();
		});
	});
	
	describe('with all fields filled in', function() {
		it('should have the same values when retrieved again', function() {
			var activity = new ActivityBuilder()
				.asBilled()
				.build();

			activity.save(function(err) {
				Activity.findById(activity.id, function(err, result) {
					helper.activitiesShouldBeEqual(result, activity);
					asyncSpecDone();
				});
			});
			asyncSpecWait();
		});
	});
});

mongoose.connection.collection('activities').drop();
	