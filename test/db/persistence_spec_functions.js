var should = require('should');

function create_entity_with_reference_and_check_populate(data) {
	describe('when ' + data.entityName + ' is saved with a reference to an existing ' + data.referenceName, function() {
		var referencedEntity = null,
			entity = null;

		beforeEach(function(done) {
			entity = data.getEntityFn();
			referencedEntity = data.buildReferenceEntityFn();
			referencedEntity.save(function(err) {
				should.not.exist(err);
				entity[data.referenceName] = referencedEntity.id;
				entity.save(function(err) {
					should.not.exist(err);
					done();
				});
			});
		});
		
		if (data.remove_entity_in_afterEach) {
			afterEach(function(done) {
				entity.remove(function(err) {
					should.not.exist(err);
					done();
				});
			});	
		}

		describe('when we specify that ' + data.referenceName + ' should be populated when we retrieve ' + data.entityName, function() {
			
			var retrievedEntity = null,
				error = null;

			beforeEach(function(done) {
				data.entityModel.findById(entity.id).populate(data.referenceName).run(function(err, result) {
					error = err;
					retrievedEntity = result;
					done();
				});
			});

			it('should not fail', function() {
				should.not.exist(error);
			});

			it('should populate the ' + data.referenceName + ' property in the returned ' + data.entityName, function() {
				data.equalityFn(referencedEntity, retrievedEntity[data.referenceName]);
			});

		});
	});
}

module.exports = {
	create_entity_with_reference_and_check_populate: create_entity_with_reference_and_check_populate
};