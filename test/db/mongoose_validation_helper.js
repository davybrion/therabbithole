var checkValidationErrorFor = function(err, validatorName, propertyName) {
	if (!err) { return false; }
	if (err.name !== 'ValidationError') { return false; }
	var value = err.errors[propertyName];
	if (!value) { return false; }
	return (value.message === 'Validator "' + validatorName + '" failed for path ' + propertyName);
};

exports.checkRequiredValidationErrorFor = function(error, propertyName) {
	return checkValidationErrorFor(error, 'required', propertyName);
};

exports.checkMaxValidationErrorFor = function(error, propertyName) {
	return checkValidationErrorFor(error, 'max', propertyName);
};

exports.checkMinValidationErrorFor = function(error, propertyName) {
	return checkValidationErrorFor(error, 'min', propertyName);
};