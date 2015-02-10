var ann = (function(options) {
	options = options || {};
	var layers = [];
	function addLayer(layer) {
		layers.push(layer);
	};

	function print() {
		var layer, type, perceptrons, perceptron, weightings;
		for(var i in layers) {
			layer = layers[i];
			type = layer.getType();
			perceptrons = layer.getPerceptrons();
			console.log(type + ' layer');
			for(var j in perceptrons) {
				perceptron = perceptrons[j];
				console.log('\tperceptron #' + perceptron.getID());
				weightings = perceptron.getWeightings()
				for(var k in weightings) {
					console.log('\t\t' + perceptron.getID() + ' -[' + weightings[k].weight + ']-> ' + weightings[k].to);
				}
			}
		}
	};

	/*
	* Public exposure for ann
	*/
	return {
		addLayer: addLayer,
		print: print
	};
});

exports.ann = ann;
exports.layer = require('./layer');
exports.perceptron = require('./perceptron');