var Activity = require('../../lib/entities').Activity,
	should = require('should');

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
			activity.performedWork[0].date.should.equal(yesterday);
			activity.performedWork[0].hours.valueOf().should.equal(8);
			activity.performedWork[1].date.should.equal(today);
			activity.performedWork[1].hours.valueOf().should.equal(7);
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
			should.exist(error);
		});

		it('should not hold the performed work for the duplicate day', function() {
			activity.performedWork.length.should.equal(1);
		});

	});

});
