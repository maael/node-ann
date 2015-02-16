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
					weightings;
				network.addPerceptron(perceptron);
				network.addWeighting({from: 'u1', to: 'u2', weighting: 1});
				weightings = network.getWeightings();
				weightings.should.be.length(1);
				weightings[0].should.have.property('from');
				weightings[0].should.have.property('to');
				weightings[0].should.have.property('weighting');
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

				var	u1 = new ann.perceptron({id: 'u1', type: 'input'}),
					u2 = new ann.perceptron({id: 'u2', bias: 0, type: 'input'}),
					u3 = new ann.perceptron({id: 'u3'}),
					u4 = new ann.perceptron({id: 'u4', bias: -6}),
					u5 = new ann.perceptron({id: 'u5', bias: -3.92, type: 'output'});

				/* Add perceptron relations and weightings */
				network.addWeighting({from: 'u1', to: 'u3', weight: 3});
				network.addWeighting({from: 'u1', to: 'u4', weight: 6});
				network.addWeighting({from: 'u2', to: 'u3', weight: 4});
				network.addWeighting({from: 'u2', to: 'u4', weight: 5});
				network.addWeighting({from: 'u3', to: 'u5', weight: 2});
				network.addWeighting({from: 'u4', to: 'u5', weight: 4});

				network.getWeightings().should.be.length(6);

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

				/* Print out network */
				//network.print();
				//network.printGraph();
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
			describe('#initialise', function() {
				it('initialise correctly', function() {
					network.initialise();
					var weightings = network.getWeightings();
					for(var i = 0; i < weightings.length; i++) {
						weightings[i].weight.should.be.within((-2/2), (2/2));
					}
					console.log(network.getWeightings());
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