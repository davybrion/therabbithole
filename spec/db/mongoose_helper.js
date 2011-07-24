beforeEach(function() {
	this.addMatchers((function() {
		var toHaveValidationErrorFor = function(err, validatorName, propertyName) {
			if (!err) { return false; }
			if (err.name !== 'ValidationError') { return false; }
			var value = err.errors[propertyName];
			if (!value) { return false; }
			return (value === 'Validator "' + validatorName + '" failed for path ' + propertyName);
		};
				
		return {
			toHaveRequiredValidationErrorFor : function(propertyName) {
				return toHaveValidationErrorFor(this.actual, 'required', propertyName);
			},
			
			toHaveMaxValidationErrorFor: function(propertyName) {
				return toHaveValidationErrorFor(this.actual, 'max', propertyName);
			},
			
			toHaveMinValidationErrorFor: function(propertyName) {
				return toHaveValidationErrorFor(this.actual, 'min', propertyName);
			}
		};
	}()));
});