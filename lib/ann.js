var ann = function(options) {
	options = options || {};
	options.learningStep = options.learningStep || 0.1;
	options.initialisationMethod = options.initialisationMethod || 'normal';
	options.dataFormat = options.dataFormat || [];
	options.epochs = options.epochs || 10000;
	options.report = options.report || false;
	options.momentum = options.momentum || 0.9;
	options.weightDecay = options.weightDecay || false;
	options.assessment = options.assessment || 'RMSE';
	options.errorThreshold = options.errorThreshold || 0.05;
	var layers = [],
		perceptrons = [],
		weightMatrix = {},
		reportText = '';
	function addWeighting(weighting) {
		var from = findPerceptron(weighting.from),
			to = findPerceptron(weighting.to),
			weight = weighting.weight || 1;
		if(weightMatrix[weighting.from] === undefined) { weightMatrix[weighting.from] = {}; }
		if(weightMatrix[weighting.to] === undefined) { weightMatrix[weighting.to] = {}; }
		weightMatrix[weighting.from][weighting.to] = weight;
		weightMatrix[weighting.to][weighting.from] = weight;
		perceptrons[from].addOutput(weighting.to); 
		perceptrons[to].addInput(weighting.from);
	}
	function getWeightings() {
		return weightMatrix;
	}
	function addLayer(layerPerceptrons) {
		layers.push(layerPerceptrons);
	}
	function getLayer(index) {
		return layers[index];
	}
	function fullyInterconnectLayers(fromLayer, toLayer) {
		var from = layers[fromLayer],
			to = layers[toLayer],
			i, j;
		for(i = 0; i < from.length; i++) {
			for(j = 0; j < to.length; j++) {
				addWeighting({from: from[i], to: to[j]});
			}
		}
	}
	function addPerceptron(perceptron) {
		perceptrons.push(perceptron);
	}
	function getPerceptrons(type) {
		var result = [];
		type = type || '';
		if(type === 'input' || type === 'hidden' || type === 'output') {
			for(var i = 0; i < perceptrons.length; i++) {
				if(perceptrons[i].getType() === type) { result.push(perceptrons[i]); }
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
			if(perceptrons[i].getID() === id) { break; }
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
				return (1 / Math.pow(sd * Math.sqrt(2 * Math.PI), Math.pow(Math.E, -(Math.pow(m - mean, 2) / (2 * Math.pow(sd, 2))))));
			}
			return gaussian(n, Math.random());
		}

		var weightFunction = ((options.initialisationMethod === 'gaussian') ? startWeightsGaussian : startWeightsNormal),
			numberOfInputs = getPerceptrons('input').length;
		for(var from in weightMatrix) {
			for(var to in weightMatrix[from]) {
				weightMatrix[from][to] = weightFunction(numberOfInputs);
				weightMatrix[to][from] = weightFunction(numberOfInputs);
			}
		}
		return this;
	}
	function assess(assessmentSet) {
		function getOutputlessSet(set, setNumber) {
		    var example = {inputSet: [], outputSet: []};
		    for(var i = 0; i < (set.length - 1); i++) {
		        example.inputSet.push([set[i][setNumber]]);
		    }
		    example.outputSet.push(set[(set.length - 1)][setNumber]);
		    return example;
		}
    	var test, error, errorText, errors = {}, predicted = [], actual = [], 
    		difference, differenceSquared = 0, differenceOverActualSquared = 0,
    		n = assessmentSet[0].length;
	    for(var i = 0; i < n; i++) {
	        test = getOutputlessSet(assessmentSet, i),
	        predicted.push(solve(test.inputSet));
	        actual.push(test.outputSet);
	        difference = predicted[i] - actual[i];
	        differenceSquared += Math.pow(difference, 2);
	        differenceOverActualSquared += Math.pow((difference / actual[i]), 2);
	    }
	    for(var i = 0; i < predicted.length; i++) {	
	        	/* RMSE Default */
	        	errors['RMSE'] = Math.sqrt(differenceSquared / n);
	        	errors['MSRE'] = (1 / n) * differenceOverActualSquared;
	        	/* TODO CE */
	        	/* 1 - (differenceSquared / actualMeanDifference) */
	        	/* TODO RSqr */
	        	/* Math.pow((sum((actual - mean)(predicted - Q~)) / Math.sqr(sum(Math.pow(actual - mean, 2)(predicted - Q~))), 2) */
	    }
        error = errors[options.assessment];
        reportText += options.assessment+' Error: ' + error.toString();
	    return error;
	}
	function report(count, epochs) {
		function progressUpdate(count, epochs) { 
			var percentage = ((count/epochs) * 100).toFixed(0), 
				barLength = 25, 
				bars = Math.floor(barLength * (percentage / 100)), 
				progress; 
			progress = '['; 
			for(var i = 0; i < bars; i++) { 
				progress += '#'; 
			} 
			for(var i = 0; i < (barLength - bars); i++) { 
				progress += ' '; 
			} 
			progress += '] ' + percentage + '% '; 
			progress += count + '/' + epochs + '';
			return progress; 
		}
		process.stdout.clearLine(); 
		process.stdout.cursorTo(0); 
		process.stdout.write(progressUpdate(count, epochs) + ' | ' + reportText);
		reportText = '';
	}
	function train(trainingSet, validationSet) {
		var exampleNumber = -1,
			activations = {}, deltas = {},
			error, previousError;
		function getError() {
			previousError = error;
			error = assess(validationSet);
		}
		function continueCheck(validationSet) {
			var check = true;
			getError();
			if(error < options.errorThreshold) { check = false; }
			return check;
		}
		function getNextExample(trainingSet) {
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
			var perceptron, perceptronID,
				sum = 0,
				sums = {},
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
			return activations[outputs[(outputs.length - 1)].getID()];
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
			var perceptron, pID, differential;
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
			var updatedWeight, updatedBias, perceptron, pID, outputs, weightChange = 0;
			for(var i = 0; i < layers.length; i++) {
				for(var j = 0; j < layers[i].length; j++) {
					perceptron = getPerceptron(layers[i][j]);
					pID = perceptron.getID();
					outputs = perceptron.getOutputs();
					for(var k = 0; k < outputs.length; k++) {
						updatedWeight =  weightMatrix[pID][outputs[k]] + (options.momentum * weightChange) + (options.learningStep * deltas[outputs[k]] * activations[pID]);
						if(j > 0) { weightChange = (updatedWeight - weightMatrix[pID][outputs[k]]); }
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
		var count = 0,
			continueLoop = true,
			outputs = [],
			example;
		console.time('Training Main Loop');
		while(continueLoop) {
			exampleNumber = -1;
			for(var i = 0; i < trainingSet[0].length; i++) {
				example = getNextExample(trainingSet);
				outputs.push(forwardPass(example));
				backwardPass(example.outputs[0]);
				updateWeights();
			}
			count++;
			continueLoop = continueCheck(validationSet) && (count < options.epochs);
			if(options.report) { report(count, options.epochs); }
		}
		if(options.report) { process.stdout.write('\n'); }
		console.timeEnd('Training Main Loop');
	}
	function solve(solveSet) {
		var activations = {};
		function sumInputs(perceptron) {
			var sum = 0,
				inputs = perceptron.getInputs();
			for(var i = 0; i < inputs.length; i++) {
				sum += activations[inputs[i]] * weightMatrix[inputs[i]][perceptron.getID()];
			}
			sum += perceptron.getBias();
			return sum;
		}
		var perceptron, perceptronID,
			sum = 0,
			sums = {},
			inputs = getPerceptrons('input'),
			outputs = getPerceptrons('output');

		/* Set initial activations for inputs */
		for(var i = 0; i < inputs.length; i++) {
			activations[inputs[i].getID()] = solveSet[i];
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
		return [activations[outputs[(outputs.length - 1)].getID()]];
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