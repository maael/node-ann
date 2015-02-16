var ann = function(options) {
	options = options || {};
	options.iterations = options.iterations || 10000;
	options.learningStep = options.learningStep || 0.1;
	options.initialisationMethod = options.initialisationMethod || 'normal';
	var layers = [],
		perceptrons = [],
		numberOfInputs = 0,
		weightings = [];
	function addWeighting(weighting) {
		weightings.push(weighting);
		var from = findPerceptron(weighting.from),
			to = findPerceptron(weighting.to);
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
		var exampleNumber = -1;
		function continueCheck() {
			return false;
		}
		function getNextExample() {
			exampleNumber++;
			return trainingSet[exampleNumber];
		}
		function forwardPass(example) {
			function sum(perceptron) {
				var sum = 0,
					inputs = perceptron.getInputs();
				for(var i = 0; i < inputs.length; i++) {
					sum += getPerceptron(inputs[i]).getBias() * getWeight(inputs[i], perceptron.getID());
				}
			}
			var result,
				perceptron,
				sums = {},
				activations = {},
				inputs = getPerceptrons('input');
			/* Set initial activations for inputs */
			for(var i = 0; i < inputs.length; i++) {
				activations[inputs[i].getID()] = example.inputs[i];
			}
			/* Calculate non-input sums and activations */
			for(var i = 1; i < layers.length; i++) {
				for(var j = 0; j < layers[i]; j++) {
					perceptron = getPerceptron(layers[i][j]);
					sum += sum(perceptron);
				}
			}

			console.log(result);
		}
		function backwardPass() {
			function sumOfOutputWeightings() {

			}
			var delta, differential, nextIsOutput = false;
			for(var i = 0; i < weightings.length; i++) {
				differential = activations[i] * (1 - activations[i]);
				if(nextIsOutput) {
					delta = (outputs[i] - activations[i]) * differential; 
				} else {
					delta = (sumOfOutputWeightings(i)) * differential;
				}
			}
		}
		function updateWeights() {

		}
		/*
		while(continueCheck()) {
			getNextExample();
			forwardPass();
			backwardPass();
			updateWeights();
		}
		*/
		forwardPass(example);
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