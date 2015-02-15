var perceptron = function(options) {
	options = options || {};
	options.bias = (typeof(options.bias) === 'number') ? options.bias : 1;
	options.inputs = options.inputs || [];
	options.outputs = options.outputs || [];
	options.id = options.id || '';

	function getID() {
		return options.id;
	}
	function getBias() {
		return options.bias;
	}

	/*
	* Public exposure for perceptron
	*/
	return {
		getID: getID,
		getBias: getBias
	};
};

module.exports = perceptron;