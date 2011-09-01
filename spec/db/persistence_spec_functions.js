function create_entity_with_reference_and_check_populate(data) {
	describe('when ' + data.entityName + ' is saved with a reference to an existing ' + data.referenceName, function() {
		var referencedEntity = null,
			entity = null;

		beforeEach(function() {
			entity = data.getEntityFn();
			referencedEntity = data.buildReferenceEntityFn();
			referencedEntity.save(function(err) {
				expect(err).toBeNull();
				entity[data.referenceName] = referencedEntity.id;
				entity.save(function(err) {
					expect(err).toBeNull();
					asyncSpecDone();
				});
			});
			asyncSpecWait();
		});
		
		if (data.remove_entity_in_afterEach) {
			afterEach(function() {
				entity.remove(function(err) {
					expect(err).toBeNull();
					asyncSpecDone();
				});
				asyncSpecWait();
			});	
		}

		describe('when we specify that ' + data.referenceName + ' should be populated when we retrieve ' + data.entityName, function() {
			
			var retrievedEntity = null;

			beforeEach(function() {
				data.entityModel.findById(entity.id).populate(data.referenceName).run(function(err, result) {
					error = err;
					retrievedEntity = result;
					asyncSpecDone();
				});
				asyncSpecWait();
			});

			it('should not fail', function() {
				expect(error).toBeNull();
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