var ann = function(options) {
    /*
    *   Network options, that shortcircuit to defaults
    */
    options = options || {};
    options.learningStep = options.learningStep || 0.1;
    options.initialisationMethod = options.initialisationMethod || 'normal';
    options.dataFormat = options.dataFormat || [];
    options.epochs = options.epochs || 10000;
    options.report = options.report || false;
    options.momentum = options.momentum || 0.9;
    options.assessment = options.assessment || 'RMSE';
    options.errorThreshold = ((options.errorThreshold === 0) ? 0 : (options.errorThreshold || 0.05));
    /*
    *   Structural variables for network
    */
    var layers = [],
        perceptrons = [],
        weightMatrix = {},
        reportText = '';
    /*
    * Load network from network created from getNetwork output
    */
    function createNetwork(network) {
        options = network.options;
        layers = network.layers;
        perceptrons = network.perceptrons;
        weightMatrix = network.weightMatrix;
    }
    /* 
    * Inputs - weighting: {to: , from:, weight: }
    * to and from must be the IDs of perceptrons in the network
    * If weight is not set, 1 is used
    */
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
    /* Getter for weight matrix, exposed for tests */
    function getWeightings() {
        return weightMatrix;
    }
    /*
    * Inputs - layerPerceptrons: [PerceptronIDs as Strings] 
    * Adds layer concept to network
    */
    function addLayer(layerPerceptrons) {
        layers.push(layerPerceptrons);
    }
    /* Getter for specific layer */
    function getLayer(index) {
        return layers[index];
    }
    /* Fully connects two layers */
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
    /*
    * Inputs - perceptron: Object initialised via perceptron module
    * Adds perceptron to network
    */
    function addPerceptron(perceptron) {
        perceptrons.push(perceptron);
    }
    /*
    * Inputs - type: 'input', 'hidden', 'output'
    * Returns the specified type if type is a valid option,
    * Else turns all the perceptrons
    */
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
    /*
    * Getter for a specific perceptron as specified by id String
    * Returns perceptron
    */
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
    /*
    * Find perceptron in internal perceptron list
    * Returns index in internal perceptron list
    */
    function findPerceptron(id) {
        var i;
        for(i = 0; i < perceptrons.length; i++) {
            if(perceptrons[i].getID() === id) { break; }
        }
        return i;
    }
    /*
    * Network Initialisation
    */
    function initialise() {
        /* Recommended Initialisation */
        function startWeightsNormal(n) {
            var max = -2/n,
                min = 2/n;
            return Math.random() * (max - min + 1) + min;
        }
        /* Uses Bishop idea of using gaussian functions*/
        function startWeightsGaussian(n) {
            function gaussian(n, m) {
                var mean = 0,
                    sd = (1/Math.sqrt(n));
                return (1 / Math.pow(sd * Math.sqrt(2 * Math.PI), Math.pow(Math.E, -(Math.pow(m - mean, 2) / (2 * Math.pow(sd, 2))))));
            }
            return gaussian(n, Math.random());
        }
        /* Initialises weights using specified method */
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
    /*
    * Network Assessment
    */
    function assess(assessmentSet) {
        /* Extract example from set */
        function getOutputlessSet(set, setNumber) {
            var example = {inputSet: [], outputSet: []};
            for(var i = 0; i < (set.length - 1); i++) {
                example.inputSet.push([set[i][setNumber]]);
            }
            example.outputSet.push(set[(set.length - 1)][setNumber]);
            return example;
        }
        /*  Iterate through set, fetching examples
        *   Save predictions and actual values for the example
        *   Also calculate difference
        *   Use to calculate differenceSquared sum and differenceOverActualSquared sum
        *   These are used in measure of difference calculations
        */
        var test, error, errorText, errors = {}, predicted = [], actual = [], 
            difference, differenceSum = 0, differenceSquared = 0, differenceOverActualSquared = 0,
            n = assessmentSet[0].length, sst = 0, ssr = 0;
        for(var i = 0; i < n; i++) {
            test = getOutputlessSet(assessmentSet, i),
            predicted.push(solve(test.inputSet));
            actual.push(test.outputSet);
            difference = predicted[i] - actual[i];
            differenceSquared += Math.pow(difference, 2);
            differenceOverActualSquared += Math.pow((difference / actual[i]), 2);
            differenceSum += difference; 
        }
        /* Calculate Total Sum of Squares for CE */
        for(var i = 0; i < n; i++) {
            sst = Math.pow(((predicted[i] - actual[i]) - (differenceSum / n)), 2);
            ssr = Math.pow((predicted[i] - actual[i]), 2);
        }
        /* Iterate through results, calculating measures of difference */
        for(var i = 0; i < predicted.length; i++) { 
                errors['RMSE'] = Math.sqrt(differenceSquared / n);
                errors['MSRE'] = (1 / n) * differenceOverActualSquared;
                errors['CE'] = 1 - (differenceSquared / sst);
                errors['RSqr'] = 1 - Math.pow((ssr / Math.sqrt(sst)), 2);
        }
        error = errors[options.assessment];
        reportText += options.assessment+' Error: ' + error.toString();
        return error;
    }
    /*
    * Method to report status via progress bar and continual RMSE output
    * Used if options.report is true
    */
    function report(count, epochs) {
        function progressUpdate(count, epochs) { 
            var percentage = ((count/epochs) * 100).toFixed(0), 
                barLength = 25, 
                bars = Math.floor(barLength * (percentage / 100)), 
                progress = '[';
            for(var i = 0; i < bars; i++) { progress += '#'; } 
            for(var i = 0; i < (barLength - bars); i++) { progress += ' '; } 
            progress += '] ' + percentage + '% '; 
            progress += count + '/' + epochs + '';
            return progress; 
        }
        process.stdout.clearLine(); 
        process.stdout.cursorTo(0); 
        process.stdout.write(progressUpdate(count, epochs) + ' | ' + reportText);
        reportText = '';
    }
    /* Training Forward Pass */
    function forwardPass(example, activations) {
        /* Calculates sum of input activations * weights for a perceptron */
        function sumInputs(perceptron) {
            var sum = 0, inputs = perceptron.getInputs();
            for(var i = 0; i < inputs.length; i++) {
                sum += activations[inputs[i]] * weightMatrix[inputs[i]][perceptron.getID()];
            }
            sum += perceptron.getBias();
            return sum;
        }
        var perceptron, perceptronID,
            sum = 0, sums = {},
            inputs = getPerceptrons('input'),
            outputs = getPerceptrons('output');

        /* Set initial activations for inputs */
        for(var i = 0; i < inputs.length; i++) {
            activations[inputs[i].getID()] = ((example.hasOwnProperty('inputs')) ? example.inputs[i] : example[i][0]);
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
        /* Return outputs activation */
        return activations;
    }
    /*
    * Network Training
    * Uses validation set to assess network against
    * TODO: Alter so can be further trained after being trained
    */
    function train(trainingSet, validationSet) {
        var exampleNumber = -1,
            activations = {}, deltas = {},
            error, previousError,
            count = 0, continueLoop = true, outputs = [], 
            example, solution;
        function getError() {
            previousError = error;
            error = assess(validationSet);
        }
        /* 
        * Checks to see if training should continue
        * False if error has fallen below the threshold specified by options.errorThreshold
        */
        function continueCheck(validationSet) {
            var check = true;
            getError();
            if(error < options.errorThreshold) { check = false; }
            return check;
        }
        /* Fetches example from training set */
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
        /* Backpropagation Learning */
        function backwardPass(exampleOutput) {
            /* Sums output delta * weight to output for a perceptron */
            function sumOfOutputWeightings(perceptron) {
                var sum = 0, outputs = perceptron.getOutputs();
                for(var i = 0; i < outputs.length; i++) {
                    sum += deltas[outputs[i]] * weightMatrix[perceptron.getID()][outputs[i]];
                }
                return sum;
            }
            var p, pID;
            for(var i = (layers.length - 1); i > 0; i--) {
                for(var j = (layers[i].length - 1); j >= 0; j--) {
                    p = getPerceptron(layers[i][j]);
                    pID = p.getID();
                    deltas[pID] = ((p.getType() === 'output') ? (exampleOutput - activations[pID]) : (sumOfOutputWeightings(p)));
                    deltas[pID] = deltas[pID] * activations[pID] * (1 - activations[pID]);
                }
            }
        }
        /* Propagate learning through network */
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
        /* Main loop of training */
        var outputPerceptrons = getPerceptrons('output');
        console.time('Training Main Loop');
        while(continueLoop) {
            exampleNumber = -1;
            for(var i = 0; i < trainingSet[0].length; i++) {
                example = getNextExample(trainingSet);
                activations = forwardPass(example, activations);
                outputs.push(activations[outputPerceptrons[(outputPerceptrons.length - 1)].getID()]);
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
    /*
    * Network Solution - calculates prediction for input set via a forward pass
    */
    function solve(solveSet) {
        var activations = forwardPass(solveSet, {}),
            outputPerceptrons = getPerceptrons('output'),
            outputs = [];
        for(var i = 0; i < outputPerceptrons.length; i++) {
            outputs.push(activations[outputPerceptrons[(outputPerceptrons.length - 1)].getID()]);
        }
        return outputs;
    }
    /*
    * Get key components of network
    */
    function getNetwork() {
        return {
            options: options,
            layers: layers,
            perceptrons: perceptrons,
            weightMatrix: weightMatrix//,
            //activations: activations,
            //deltas: deltas
        };
    }
    /*
    * Public exposure for ann
    */
    return {
        createNetwork: createNetwork,
        addWeighting: addWeighting,
        getWeightings: getWeightings,
        addLayer: addLayer,
        getLayer: getLayer,
        fullyInterconnectLayers: fullyInterconnectLayers,
        addPerceptron: addPerceptron,
        getPerceptrons: getPerceptrons,
        getPerceptron: getPerceptron,
        findPerceptron: findPerceptron,
        initialise: initialise,
        train: train,
        solve: solve,
        getNetwork: getNetwork
    };
};

exports.ann = ann;
exports.perceptron = require('./perceptron');