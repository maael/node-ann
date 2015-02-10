var ann = function(options) {
	options = options || {};
	var layers = [];
	function addLayer(layer) {
		layers.push(layer);
	}

	function print() {
		var layer, type, perceptrons, perceptron, weightings, i, j, k;
		for(i = 0; i < layers.length; i++) {
			layer = layers[i];
			type = layer.getType();
			perceptrons = layer.getPerceptrons();
			console.log(type + ' layer');
			for(j = 0; j < perceptrons.length; j++) {
				perceptron = perceptrons[j];
				console.log('\tperceptron #' + perceptron.getID());
				weightings = perceptron.getWeightings()
				for(k = 0; k < weightings; k++) {
					console.log('\t\t' + perceptron.getID() + ' -[' + weightings[k].weight + ']-> ' + weightings[k].to);
				}
			}
		}
	}

	/*
	* Public exposure for ann
	*/
	return {
		addLayer: addLayer,
		print: print
	};
};

exports.ann = ann;
exports.layer = require('./layer');
exports.perceptron = require('./perceptron');