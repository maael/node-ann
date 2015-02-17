var ann = function(options) {
	options = options || {};
	options.iterations = options.iterations || 10000;
	options.learningStep = options.learningStep || 0.1;
	options.initialisationMethod = options.initialisationMethod || 'normal';
	options.dataFormat = options.dataFormat || [];
	var layers = [],
		perceptrons = [],
		numberOfInputs = 0,
		weightings = [],
		weightMatrix = {};
	function addWeighting(weighting) {
		weightings.push(weighting);
		var from = findPerceptron(weighting.from),
			to = findPerceptron(weighting.to),
			weight = weighting.weight || 1;
		if(weightMatrix[weighting.from] === undefined) weightMatrix[weighting.from] = {};
		if(weightMatrix[weighting.to] === undefined) weightMatrix[weighting.to] = {};
		weightMatrix[weighting.from][weighting.to] = weight;
		weightMatrix[weighting.to][weighting.from] = weight;
		perceptrons[from].addOutput(weighting.to); 
		perceptrons[to].addInput(weighting.from);
	}
	function getWeightings() {
		return weightings;
	}
	function addLayer(layerPerceptrons) {
		layers.push(layerPerceptrons);
	}
	function getLayer(index) {
		return layers[index];
	}
	function addPerceptron(perceptron) {
		perceptrons.push(perceptron);
	}
	function getPerceptrons(type) {
		var result = [];
		type = type || '';
		if(type === 'input' || type === 'hidden' || type === 'output') {
			for(var i = 0; i < perceptrons.length; i++) {
				if(perceptrons[i].getType() === type) result.push(perceptrons[i]);
			}
		} else {
			result = perceptrons;
		}
		return result;
	}
	function getPerceptron(id) {
		var result, i;
		for(i = 0; i < perceptrons.length; i++) {
			if(perceptrons[i].getID() === id) {
				result = perceptrons[i];
				break;
			}
		}
		return result;
	}
	function findPerceptron(id) {
		var i;
		for(i = 0; i < perceptrons.length; i++) {
			if(perceptrons[i].getID() === id) break;
		}
		return i;
	}
	function initialise() {
		function startWeightsNormal(n) {
			var max = -2/n,
				min = 2/n;
			return Math.random() * (max - min + 1) + min;
		}

		/* Uses Bishop */
		function startWeightsGaussian(n) {
			function gaussian(n, m) {
				var mean = 0,
					sd = (1/Math.sqrt(n));
				return (1/(sd * Math.sqrt(2 * Math.PI)))(Math.E^-(((m - mean)^2)/2(sd^2)));
			}
			return gaussian(n, Math.random());
		}

		var weightFunction = ((options.initialisationMethod === 'gaussian') ? startWeightsGaussian : startWeightsNormal),
			numberOfInputs = getPerceptrons('input').length;
		for(var i = 0; i < weightings.length; i++) {
			weightings[i]['weight'] = weightFunction(numberOfInputs);
		}
		return this;
	}
	function selectPerceptron() {

	}
	function mainLoop(trainingSet) {
		var exampleNumber = -1,
			activations = {}, sums = {}, deltas = {};
		function continueCheck() {
			return false;
		}
		function getNextExample() {
			exampleNumber++;
			var example = {inputs: [], outputs: []};
			for(var i = 0; i < trainingSet.length; i++) {
				if(options.dataFormat[i] === 'output') {
					example.outputs.push(trainingSet[i][exampleNumber]);
				} else {
					example.inputs.push(trainingSet[i][exampleNumber]);
				}
			}
			return example;
		}
		function forwardPass(example) {
			function sumInputs(perceptron) {
				var sum = 0,
					inputs = perceptron.getInputs();
				for(var i = 0; i < inputs.length; i++) {
					sum += activations[inputs[i]] * weightMatrix[inputs[i]][perceptron.getID()];
				}
				sum += perceptron.getBias();
				return sum;
			}
			var result, perceptron, perceptronID,
				sum = 0,
				inputs = getPerceptrons('input'),
				outputs = getPerceptrons('output');

			/* Set initial activations for inputs */
			for(var i = 0; i < inputs.length; i++) {
				activations[inputs[i].getID()] = example.inputs[i];
			}
			/* Calculate non-input sums and activations */
			for(var i = 1; i < layers.length; i++) {
				for(var j = 0; j < layers[i].length; j++) {
					perceptron = getPerceptron(layers[i][j]);
					perceptronID = perceptron.getID();
					sum = sumInputs(perceptron);
					sums[perceptronID] = sum;
					activations[perceptronID] = (1/(1+(Math.pow(Math.E, -sum))));
				}
			}
			console.log(activations[outputs[(outputs.length - 1)].getID()]);
		}
		function backwardPass(exampleOutput) {
			function sumOfOutputWeightings(perceptron) {
				var sum = 0,
					outputs = perceptron.getOutputs();
				for(var i = 0; i < outputs.length; i++) {
					sum += deltas[outputs[i]] * weightMatrix[perceptron.getID()][outputs[i]];
				}
				return sum;
			}
			for(var i = (layers.length - 1); i > 0; i--) {
				for(var j = (layers[i].length - 1); j >= 0; j--) {
					perceptron = getPerceptron(layers[i][j]);
					pID = perceptron.getID();
					differential = activations[pID] * (1 - activations[pID]);
					if(perceptron.getType() === 'output') {
						deltas[pID] = (exampleOutput - activations[pID]) * differential;
					} else {
						deltas[pID] = (sumOfOutputWeightings(perceptron) * differential);
					}
				}
			}
		}
		function updateWeights() {
			for(var i = 0; i < layers.length; i++) {
				for(var j = 0; j < layers[i].length; j++) {
					perceptron = getPerceptron(layers[i][j]);
					pID = perceptron.getID();
					outputs = perceptron.getOutputs();
					for(var k = 0; k < outputs.length; k++) {
						updatedWeight = weightMatrix[pID][outputs[k]] + (options.learningStep * deltas[outputs[k]] * activations[pID]);
						weightMatrix[pID][outputs[k]] = updatedWeight;
						weightMatrix[outputs[k]][pID] = updatedWeight;
					}
					if(perceptron.getType() !== 'input') {
						updatedBias = perceptron.getBias() + (options.learningStep * deltas[pID] * 1);
						perceptron.updatedBias(updatedBias);
					}
				}
			}
		}
		var count = 0;
		while(count < 10000) {
			exampleNumber = -1;
			for(var i = 0; i < trainingSet[0].length; i++) {
				var example = getNextExample();
				forwardPass(example);
				backwardPass(example.outputs[0]);
				updateWeights();
			}
			count++;
		}
	}
	function train(trainingSet) {
		mainLoop(trainingSet);
	}
	function solve(testSet) {

	}

	/*
	* Public exposure for ann
	*/
	return {
		addWeighting: addWeighting,
		getWeightings: getWeightings,
		addLayer: addLayer,
		getLayer: getLayer,
		addPerceptron: addPerceptron,
		getPerceptrons: getPerceptrons,
		getPerceptron: getPerceptron,
		findPerceptron: findPerceptron,
		initialise: initialise,
		train: train,
		solve: solve
	};
};

exports.ann = ann;
exports.perceptron = require('./perceptron');