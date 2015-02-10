var ann = function(options) {
	options = options || {};
	options.iterations = options.iterations || 10000;
	options.learningStep = options.learningStep || 0.1;
	var layers = [];
	function addLayer(layer) {
		layers.push(layer);
	}

	function print() {
		var layer, type, perceptrons, perceptron, weightings, i, j, k;
		console.log('\n');
		for(i = 0; i < layers.length; i++) {
			layer = layers[i];
			type = layer.getType();
			perceptrons = layer.getPerceptrons();
			console.log(type + ' layer');
			for(j = 0; j < perceptrons.length; j++) {
				perceptron = perceptrons[j];
				console.log('\tperceptron #' + perceptron.getID());
				weightings = perceptron.getWeightings();
				for(k = 0; k < weightings; k++) {
					console.log('\t\t' + perceptron.getID() + ' -[' + weightings[k].weight + ']-> ' + weightings[k].to);
				}
			}
		}
		console.log('\n');
	}

	function printGraph() {
		var layer, type, perceptrons, perceptron, weightings,
			perceptronText,
			i, j, k;
		console.log('\n');
		for(i = 0; i < layers.length; i++) {
			layer = layers[i];
			perceptrons = layer.getPerceptrons();
			perceptronText = '';
			for(j = 0; j < perceptrons; j++) {
				perceptron = perceptrons[j];
				perceptronText += perceptron.getID() + perceptron.getBias();
			}
			console.log('text' + perceptronText);
		}
		console.log('\n');
	}

	/*
	* Public exposure for ann
	*/
	return {
		addLayer: addLayer,
		print: print,
		printGraph: printGraph
	};
};

exports.ann = ann;
exports.layer = require('./layer');
exports.perceptron = require('./perceptron');