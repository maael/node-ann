var ann = function(options) {
	options = options || {};
	options.iterations = options.iterations || 10000;
	options.learningStep = options.learningStep || 0.1;
	options.initialisationMethod = options.initialisationMethod || 'normal';
	var layers = [],
		weightings = [];
	function addWeighting(weighting) {
		weightings.push(weighting);
	}
	function getWeightings() {
		return weightings;
	}
	function addLayer(layer) {
		layers.push(layer);
	}
	function getLayers() {
		return layers;
	}
	function findPerceptron(id) {
		var result, i, j, perceptrons;
		for(i = 0; i < layers.length; i++) {
			perceptrons = layers[i].getPerceptrons();
			for(j = 0; j < perceptrons.length; j++) {
				if(perceptrons[j].getID() === id) {
					result = perceptrons[j];
					break;
				}
			}
		}
		return result;
	}
	function print() {
		var perceptrons, perceptron, weightings, i, j, k;
		console.log('\n');
		for(i = 0; i < layers.length; i++) {
			perceptrons = layers[i].getPerceptrons();
			console.log(layers[i].getType() + ' layer');
			for(j = 0; j < perceptrons.length; j++) {
				perceptron = perceptrons[j];
				console.log('\tperceptron #' + perceptron.getID());
				weightings = perceptron.getWeightings();
				for(k = 0; k < weightings.length; k++) {
					console.log('\t\t' + perceptron.getID() + ' -[' + weightings[k].weight + ']-> ' + weightings[k].to);
				}
			}
		}
		console.log('\n');
	}
	function printGraph() {
		var perceptrons, weightings, perceptronDrawing,
			perceptronText1 = '', perceptronText2 = '', perceptronText3 = '',
			i, j, k;
		function drawPerceptron(value, blockWidth, spaceWidth) {
			var i, blockSpaces, blockBefore, blockAfter,
				blockBorder = '', separator = '', spacesBefore = '', spacesAfter = '';
			blockSpaces = (blockWidth - value.toString().length)/2;
			blockBefore = Math.floor(blockSpaces);
			blockAfter = Math.ceil(blockSpaces);
			for(i = 0; i < blockWidth + 2; i++) blockBorder += '-';
			for(i = 0; i < spaceWidth; i++) separator += ' ';
			for(i = 0; i < blockBefore; i++) spacesBefore += ' ';
			for(i = 0; i < blockAfter; i++) spacesAfter += ' ';
			return {
				top: blockBorder + separator,
				middle: '|' + spacesBefore + value + spacesAfter + '|' + separator,
				bottom: blockBorder + separator
			};
		}
		console.log('\n');
		for(i = 0; i < layers.length; i++) {
			perceptrons = layers[i].getPerceptrons();
			perceptronText1 = '';
			perceptronText2 = '';
			perceptronText3 = '';
			for(j = 0; j < perceptrons.length; j++) {
				perceptronDrawing = drawPerceptron(perceptrons[j].getBias(), 7, 2);
				perceptronText1 += perceptronDrawing.top;
				perceptronText2 += perceptronDrawing.middle;
				perceptronText3 += perceptronDrawing.bottom;
			}
			console.log('\t' + perceptronText1);
			console.log(layers[i].getType() + '\t' + perceptronText2);
			console.log('\t' + perceptronText3);
		}
		console.log('\n');
	}
	function initialise() {
		function startWeightsNormal(n) {
			var max = -2/n,
				min = 2/n;
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
		function startWeightsBishop(n) {
			function gaussian(n, m) {
				var mean = 0,
					sd = (1/Math.sqrt(n));
				return (1/(sd * Math.sqrt(2 * Math.PI)))(Math.E^-(((m - mean)^2)/2(sd^2)));
			}
			return gaussian(n, Math.random());
		}

		var weightFunction = ((options.initialisationMethod === 'gaussian') ? startWeightsBishop : startWeightsNormal);

	}
	function selectPerceptron() {

	}
	function mainLoop(trainingSet) {
		function continueCheck() {

		}
		function getNextExample() {

		}
		function forwardPass() {

		}
		function backwardPass() {

		}
		function updateWeights() {

		}
		while(continueCheck()) {
			getNextExample();
			forwardPass();
			backwardPass();
			updateWeights();
		}
	}
	function train(trainingSet) {
		initialise();
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
		getLayers: getLayers,
		findPerceptron: findPerceptron,
		print: print,
		printGraph: printGraph,
		train: train,
		solve: solve
	};
};

exports.ann = ann;
exports.layer = require('./layer');
exports.perceptron = require('./perceptron');