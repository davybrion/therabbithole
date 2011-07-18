beforeEach(function() {
	this.addMatchers({
		toHaveRequiredValidationErrorFor : function(propertyName) {
			var err = this.actual;
			if (!err) { return false; }
			if (err.name !== 'ValidationError') { return false; }
			var value = err.errors[propertyName];
			if (!value) { return false; }
			return (value === 'Validator "required" failed for path ' + propertyName);
		}
	});
});