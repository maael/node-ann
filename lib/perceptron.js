var perceptron = function(options) {
	options = options || {};
	options.bias = (typeof(options.bias) === 'number') ? options.bias : 1; 
	options.type = options.type || 'hidden';
	options.id = options.id || '';

	var inputs = [],
		outputs = [];

	function getID() {
		return options.id;
	}
	function getBias() {
		return options.bias;
	}
	function getType() {
		return options.type;
	}
	function getInputs() {
		return inputs;
	}
	function getOutputs() {
		return outputs;
	}
	function addInput(inputID) {
		inputs.push(inputID);
	}
	function addOutput(outputID) {
		outputs.push(outputID);
	}
	function updatedBias(newBias) {
		options.bias = newBias;
	}

	/*
	* Public exposure for perceptron
	*/
	return {
		getID: getID,
		getBias: getBias,
		getType: getType,
		getInputs: getInputs,
		getOutputs: getOutputs,
		addInput: addInput,
		addOutput: addOutput,
		updatedBias: updatedBias
	};
};

module.exports = perceptron;