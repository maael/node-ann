var ann = require('..'),
	chai = require('chai'),
	should = chai.should();

describe('node-ann', function() {
	describe('#perceptron', function() {
		describe('initialisation', function() {
			it('initialises to an object', function() {
				var perceptron = new ann.perceptron();
				perceptron.should.be.an('object');
			});
			it('initialises with bias correctly', function() {
				var perceptron1 = new ann.perceptron({bias: 0}),
					perceptron2 = new ann.perceptron({bias: 1}),
					perceptron3 = new ann.perceptron({bias: -1});
				perceptron1.getBias().should.be.equal(0);
				perceptron2.getBias().should.be.equal(1);
				perceptron3.getBias().should.be.equal(-1);
			});
			it('initialises with id correctly', function() {
				var perceptron1 = new ann.perceptron({id: 'i1'}),
					perceptron2 = new ann.perceptron({id: 'what'}),
					perceptron3 = new ann.perceptron({id: '1'});
				perceptron1.getID().should.be.equal('i1');
				perceptron2.getID().should.be.equal('what');
				perceptron3.getID().should.be.equal('1');
			});
		});
		describe('usage', function() {
			it('adds perceptron weightings and relationships correctly', function() {
				var network = new ann.ann(),
					perceptron = new ann.perceptron({id: 'u1'}),
					perceptron2 = new ann.perceptron({id: 'u2'}),
					weightings;
				network.addPerceptron(perceptron);
				network.addPerceptron(perceptron2);
				network.addWeighting({from: 'u1', to: 'u2', weighting: 1});
				network.getPerceptron('u1').getOutputs().should.be.eql(['u2']);
				network.getPerceptron('u2').getInputs().should.be.eql(['u1']);
				weightings = network.getWeightings();
				weightings.should.be.an('object');
			});
		});
	});
	describe('#ann', function() {
		describe('initialisation', function() {
			it('initialises to an object', function() {
				var network = new ann.ann();
				network.should.be.an('object');
			});			
		});
		describe('usage', function() {
			var network;
			describe('network creation', function() {
				/* Variables initialisation */
				network = new ann.ann({
					dataFormat: [
						'input',
						'input',
						'output'
					],
					epochs: 10000
				});

				/* Artifical Initialisation */
				/* Create perceptrons with initial bias */
				var	u1 = new ann.perceptron({id: 'u1', type: 'input'}),
					u2 = new ann.perceptron({id: 'u2', bias: 0, type: 'input'}),
					u3 = new ann.perceptron({id: 'u3'}),
					u4 = new ann.perceptron({id: 'u4', bias: -6}),
					u5 = new ann.perceptron({id: 'u5', bias: -3.92, type: 'output'});
				it('adds perceptrons correctly', function() {
					/* Add perceptrons to network */
					/* Add input layer */
					network.addPerceptron(u1);
					network.addPerceptron(u2);
					/* Add hidden layer */
					network.addPerceptron(u3);
					network.addPerceptron(u4);
					/* Add output layer */
					network.addPerceptron(u5);

					network.getPerceptrons('input').should.be.length(2);
					network.getPerceptrons('hidden').should.be.length(2);
					network.getPerceptrons('output').should.be.length(1);
					network.getPerceptrons().should.be.length(5);
				});
				it('adds layer groupings correctly', function() {
					network.addLayer(['u1', 'u2']);
					network.addLayer(['u3', 'u4']);
					network.addLayer(['u5']);
					
					network.getLayer(0).should.be.length(2);
					network.getLayer(1).should.be.length(2);
					network.getLayer(2).should.be.length(1);
				});
				it('adds weightings correctly', function() {
					/* Add perceptron relations and weightings */
					network.addWeighting({from: 'u1', to: 'u3', weight: 3});
					network.addWeighting({from: 'u1', to: 'u4', weight: 6});
					network.addWeighting({from: 'u2', to: 'u3', weight: 4});
					network.addWeighting({from: 'u2', to: 'u4', weight: 5});
					network.addWeighting({from: 'u3', to: 'u5', weight: 2});
					network.addWeighting({from: 'u4', to: 'u5', weight: 4});

					network.getWeightings().should.be.an('object');
				});
			});
			describe('#getPerceptron', function() {
				it('gets a perceptron by id correctly', function() {
					var foundU5 = network.getPerceptron('u5'),
						noSuchU7 = network.getPerceptron('u7');
					foundU5.should.be.an('object');
					(typeof(noSuchU7)).should.equal('undefined');
				});	
			});
			describe('#findPerceptron', function() {
				it('gets the index of a perceptron by id correctly', function() {
					var indexU5 = network.findPerceptron('u5');
					indexU5.should.be.equal(4);
				});
			});
			describe('#initialise', function() {
				it('initialise correctly', function() {
					/*
					* Network Set Up
					*/

					/* Variables initialisation */
					var networkInit = new ann.ann({
						dataFormat: [
							'input',
							'input',
							'output'
						]
					});

					/* Create perceptrons */
					var	u1 = new ann.perceptron({id: 'u1', type: 'input'}),
						u2 = new ann.perceptron({id: 'u2', type: 'input'}),
						u3 = new ann.perceptron({id: 'u3'}),
						u4 = new ann.perceptron({id: 'u4'}),
						u5 = new ann.perceptron({id: 'u5', type: 'output'});

					/* Add perceptrons to network */
					/* Add input layer */
					networkInit.addPerceptron(u1);
					networkInit.addPerceptron(u2);
					/* Add hidden layer */
					networkInit.addPerceptron(u3);
					networkInit.addPerceptron(u4);
					/* Add output layer */
					networkInit.addPerceptron(u5);

					networkInit.getPerceptrons('input').should.be.length(2);
					networkInit.getPerceptrons('hidden').should.be.length(2);
					networkInit.getPerceptrons('output').should.be.length(1);
					networkInit.getPerceptrons().should.be.length(5);

					networkInit.addLayer(['u1', 'u2']);
					networkInit.addLayer(['u3', 'u4']);
					networkInit.addLayer(['u5']);
					
					network.getLayer(0).should.be.length(2);
					network.getLayer(1).should.be.length(2);
					network.getLayer(2).should.be.length(1);

					/* Add perceptron relations and weightings */
					networkInit.addWeighting({from: 'u1', to: 'u3'});
					networkInit.addWeighting({from: 'u1', to: 'u4'});
					networkInit.addWeighting({from: 'u2', to: 'u3'});
					networkInit.addWeighting({from: 'u2', to: 'u4'});
					networkInit.addWeighting({from: 'u3', to: 'u5'});
					networkInit.addWeighting({from: 'u4', to: 'u5'});

					networkInit.getWeightings().should.be.an('object');

					/* Network initialisation - sets biases and weightings */
					networkInit.initialise();

					var weightMatrix = networkInit.getWeightings(),
						numberOfInputs = networkInit.getPerceptrons('input').length;
					for(var from in weightMatrix) {
						for( var to in weightMatrix[from]) {
							weightMatrix[from][to].should.be.within((-2/numberOfInputs), (2/numberOfInputs));
						}
					}
				});
				describe('#getNetwork', function() {
					it('returns a representation of the network', function() {

					});
				});
				describe('#createNetwork', function() {
					it('recreates a network from a representation', function() {

					});
				});
			});
			describe('#train', function() {
				it('trains correctly', function() {
					this.timeout(10000);
					// Use XOR test
					var trainingSet = [
						[1, 0, 0], // Input 1
						[0, 1, 0], // Input 2
						[1, 1, 0]  // Output
					];
					var validationSet = [
						[1], // Input 1
						[1], // Input 2
						[0]  // Output
					];
					network.train(trainingSet, validationSet);
				});
				it('can be trained again after training', function() {

				});
			});
			describe('#solve', function() {
				it('solves correctly', function() {
					var testSet00 = [[0],[0]],
						testSet01 = [[0],[1]];
					network.solve(testSet00)[0].should.within(0, 0.05);
					network.solve(testSet01)[0].should.within(0.95, 1);
				});	
			});
			
		});
	});
})