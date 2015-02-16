var perceptron = function(options) {
	options = options || {};
	options.bias = (typeof(options.bias) === 'number') ? options.bias : 1; 
	options.type = options.type || 'hidden';
	options.inputs = options.inputs || [];
	options.outputs = options.outputs || [];
	options.id = options.id || '';

	function getID() {
		return options.id;
	}
	function getBias() {
		return options.bias;
	}
	function getType() {
		return options.type;
	}

	/*
	* Public exposure for perceptron
	*/
	return {
		getID: getID,
		getBias: getBias,
		getType: getType
	};
};

module.exports = perceptron;