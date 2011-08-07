var Activity = require('../../lib/entities').Activity;

describe('given an activity', function() {

	var activity = null,
		today = new Date(),
		yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	beforeEach(function() {
		activity = new Activity();
	});

	describe('when you add performed work for new days', function() {
		
		beforeEach(function() {
			activity.addPerformedWork(yesterday, 8);
			activity.addPerformedWork(today, 7);
		});

		it('should hold the values in the performedWork array', function() {
			expect(activity.performedWork[0].date).toEqual(yesterday);
			expect(activity.performedWork[0].hours).toEqual(8);
			expect(activity.performedWork[1].date).toEqual(today);
			expect(activity.performedWork[1].hours).toEqual(7);
		});

	});

	describe('when you add performed work for a day which has already been added', function() {
		
		var error = null;

		beforeEach(function() {
			activity.addPerformedWork(today, 8);
			try {
				activity.addPerformedWork(today, 8);
			} 
			catch(err) {
				error = err;
			}
		});

		it('should throw an exception', function() {
			expect(error).not.toBe(null);
		});

		it('should not hold the performed work for the duplicate day', function() {
			expect(activity.performedWork.length).toEqual(1);
		});

	});

});
