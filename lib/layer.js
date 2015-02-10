var layer = function(options) {
	options = options || {};
	options.type = options.type || 'hidden';
	var perceptrons = [];

	function addPerceptron(perceptron) {
		perceptrons.push(perceptron);
	}
	function getPerceptrons() {
		return perceptrons;
	}
	function getType() {
		return options.type;
	}

	/*
	* Public exposure for layer
	*/
	return {
		addPerceptron: addPerceptron,
		getPerceptrons: getPerceptrons,
		getType: getType
	};
};

module.exports = layer;