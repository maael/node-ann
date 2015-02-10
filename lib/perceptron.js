var perceptron = (function(options) {
	options = options || {};
	options.bias = options.bias || 1;
	options.inputs = options.inputs || [];
	options.outputs = options.outputs || [];
	options.id = options.id || '';
	var weightings = [];

	function getID() {
		return options.id;
	};
	function addWeighting(weighting) {
		weightings.push(weighting);
	};
	function getWeightings() {
		return weightings;
	};

	/*
	* Public exposure for perceptron
	*/
	return {
		getID: getID,
		addWeighting: addWeighting,
		getWeightings: getWeightings
	};
});

module.exports = perceptron;