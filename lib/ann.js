var ann = function(options) {
	options = options || {};
	options.iterations = options.iterations || 10000;
	options.learningStep = options.learningStep || 0.1;
	options.initialisationMethod = options.initialisationMethod || 'normal';
	options.dataFormat = options.dataFormat || [];
	options.epochs = options.epochs || 10000;
	options.report = options.report || false;
	options.momentum = options.momentum || 0.9;
	options.boldDriver = options.boldDriver || false;
	options.annealing = options.annealing || false;
	options.weightDecay = options.weightDecay || false;
	options.assessment = options.assessment || 'RMSE';
	options.errorThreshold = options.errorThreshold || 0.05;
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
	function assess(assessmentSet) {
		function getOutputlessSet(set, setNumber) {
		    var example = {inputSet: [], outputSet: []};
		    for(var i = 0; i < (set.length - 1); i++) {
		        example.inputSet.push([set[i][setNumber]]);
		    }
		    example.outputSet.push(set[(set.length - 1)][setNumber]);
		    return example;
		}
    	var test, error, errorText, MSREerror, RMSEerror, CEerror, RSqrError, predicted = [], actual = [], 
    		differenceSquared = 0, differenceOverActualSquared = 0,
    		n = assessmentSet[0].length;
	    for(var i = 0; i < n; i++) {
	        test = getOutputlessSet(assessmentSet, i),
	        predicted.push(solve(test.inputSet));
	        actual.push(test.outputSet);
	        differenceSquared += Math.pow((predicted[i] - actual[i]), 2);
	        differenceOverActualSquared += Math.pow(((predicted[i] - actual[i]) / actual[i]), 2);
	    }
	    for(var i = 0; i < predicted.length; i++) {	
	        	/* RMSE Default */
	        	RMSEerror = Math.sqrt(differenceSquared / n);
	        	MSREerror = (1 / n) * differenceOverActualSquared;
	        	/* TODO */
	        	/* 1 - (differenceSquared / actualMeanDifference) */
	        	/* TODO */
	        	/* Math.pow((sum((actual - mean)(predicted - Q~)) / Math.sqr(sum(Math.pow(actual - mean, 2)(predicted - Q~))), 2) */
	    }
        if(options.assessment === 'MSRE') {
        	error = MSREerror;
        } else if (options.assessment === 'CE') {
        	error = CEerror;
        } else if (options.assessment === 'RSqr') {
        	error = RSqrError;
        } else {
        	error = RMSEerror;
        }    
	    if(options.report) {
			process.stdout.clearLine(); 
			process.stdout.cursorTo(0, 0);
			errorText = 'RMSE Error: ' + RMSEerror.toString() + '\n';
			errorText += 'MSRE Error: ' + MSREerror.toString() + '\n';
			process.stdout.write(errorText);  	    	
	    }
	    return error;
	}
	function train(trainingSet, validationSet) {
		var exampleNumber = -1,
			activations = {}, deltas = {},
			previousError;
		function continueCheck(validationSet) {
			var check = true,
				error = assess(validationSet);
			if(error < options.errorThreshold) check = false;
			if(options.boldDriver && previousError !== undefined) boldDriver(error, previousError);
			previousError = error;
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
			var result, perceptron, perceptronID,
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
						updatedWeight = weightMatrix[pID][outputs[k]] + (options.momentum * weightChange) + (options.learningStep * deltas[outputs[k]] * activations[pID]);
						if(j > 0) weightChange = (updatedWeight - weightMatrix[pID][outputs[k]]);
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
		function annealing() {

		}
		function boldDriver(currentError, previousError) {
			var errorChange = currentError - previousError; 
			if(errorChange > 0) {
				// Error function is increasing, reduce step
				options.learningStep *= 0.5;
			} else {
				// Error function is decreasing, increase step
				options.learningStep *= 1.1;
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
			if(options.report) progressUpdate(count, options.epochs);
		}
		if(options.report) process.stdout.write('\n');
		console.timeEnd('Training Main Loop');
		function progressUpdate(count, epochs) { 
			var percentage = ((count/epochs) * 100).toFixed(0), 
				barLength = 50, 
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
			progress += count + '/' + epochs; 
			process.stdout.clearLine(); 
			process.stdout.cursorTo(0); 
			process.stdout.write(progress); 
		}
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
		var result, perceptron, perceptronID,
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