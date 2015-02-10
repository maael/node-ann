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
		});
		describe('usage', function() {
			it('adds perceptron weightings and relationships correctly', function() {
				var network = new ann.ann(),
					layer = new ann.layer(),
					perceptron = new ann.perceptron({id: 'u1'}),
					weightings;
				layer.addPerceptron(perceptron);
				network.addLayer(layer);
				network.addWeighting({from: 'u1', to: 'u2', weighting: 1});
				weightings = network.getWeightings();
				weightings.should.be.length(1);
				weightings[0].should.have.property('from');
				weightings[0].should.have.property('to');
				weightings[0].should.have.property('weighting');
			});
		});
	});
	describe('#layer', function() {
		describe('initialisation', function() {
			it('initialises to an object', function() {
				var layer = new ann.layer();
				layer.should.be.an('object');
			});
			it('initialises hidden layers correctly', function() {
				var hiddenLayer = new ann.layer();
				hiddenLayer.getType().should.eql('hidden');
			});
			it('initialises input layers correctly', function() {
				var inputLayer = new ann.layer({type: 'input'});
				inputLayer.getType().should.eql('input');
			});
			it('initialises output layers correctly', function() {
				var outputLayer = new ann.layer({type: 'output'});
				outputLayer.getType().should.eql('output');
			});
		});
		describe('usage', function() {
			it('adds perceptrons to the layer correctly', function() {
				var layer = new ann.layer(),
					perceptron = new ann.perceptron();
				layer.addPerceptron(perceptron);
				layer.getPerceptrons().should.have.length(1);
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
			it('creates a network correctly', function() {
				/*
				* Network Set Up
				*/

				/* Variables initialisation */
				network = new ann.ann();

				var	inputLayer = new ann.layer({type: 'input'}),
					hiddenLayer1 = new ann.layer(),
					outputLayer = new ann.layer({type: 'output'}),
					u1 = new ann.perceptron({id: 'u1'}),
					u2 = new ann.perceptron({id: 'u2', bias: 0}),
					u3 = new ann.perceptron({id: 'u3'}),
					u4 = new ann.perceptron({id: 'u4', bias: -6}),
					u5 = new ann.perceptron({id: 'u5', bias: -3.92});

				/* Add perceptron relations and weightings */
				network.addWeighting({from: 'u1', to: 'u3', weight: 3});
				network.addWeighting({from: 'u1', to: 'u4', weight: 6});
				network.addWeighting({from: 'u2', to: 'u3', weight: 4});
				network.addWeighting({from: 'u2', to: 'u4', weight: 5});
				network.addWeighting({from: 'u3', to: 'u5', weight: 2});
				network.addWeighting({from: 'u4', to: 'u5', weight: 4});

				network.getWeightings().should.be.length(6);

				/* Add perceptrons to layers */
				inputLayer.addPerceptron(u1);
				inputLayer.addPerceptron(u2);
				hiddenLayer1.addPerceptron(u3);
				hiddenLayer1.addPerceptron(u4);
				outputLayer.addPerceptron(u5);

				inputLayer.getPerceptrons().should.be.length(2);
				hiddenLayer1.getPerceptrons().should.be.length(2);
				outputLayer.getPerceptrons().should.be.length(1);

				/* Add layers to network */
				network.addLayer(inputLayer);
				network.addLayer(hiddenLayer1);
				network.addLayer(outputLayer);

				network.getLayers().should.be.length(3);

				/* Print out network */
				//network.print();
				network.printGraph();
				/*
				* Network Testing
				*/
			});
			describe('#findPerceptron', function() {
				it('finds perceptrons correctly', function() {
					var foundU5 = network.findPerceptron('u5'),
						noSuchU7 = network.findPerceptron('u7');
					foundU5.should.be.an('object');
					(typeof(noSuchU7)).should.equal('undefined');
				});	
			});
			describe('#train', function() {
				it('trains correctly', function() {

				});	
			});
			describe('#solve', function() {
				it('solves correctly', function() {
					
				});	
			});
			
		});
	});
})