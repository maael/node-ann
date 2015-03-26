var perceptron = function(options) {
    options = options || {};
    options.bias = (typeof(options.bias) === 'number') ? options.bias : 1; 
    options.type = options.type || 'hidden';
    options.id = options.id || '';
    /* Private Variables */ 
    var inputs = [],
        outputs = [];
    /* Getter functions */
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
    /* Add ID for a perceptron to input list */
    function addInput(inputID) {
        inputs.push(inputID);
    }
    /* Add ID for a perceptron to output list */
    function addOutput(outputID) {
        outputs.push(outputID);
    }
    /* Update perceptron bias */
    function updatedBias(newBias) {
        options.bias = newBias;
    }
    /* Retrieve perceptron representation */
    function getPerceptron() {
        return {
            perOptions: options,
            inputs: inputs,
            outputs: outputs
        }
    }
    /* Load perceptron from representation */
    function createPerceptron(representation) {
        options = representation.perOptions;
        inputs = representation.inputs;
        outputs = representation.outputs;
        return this;
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
        updatedBias: updatedBias,
        getPerceptron: getPerceptron,
        createPerceptron: createPerceptron
    };
};

module.exports = perceptron;
