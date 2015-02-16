# node-ann
[![Build Status](https://img.shields.io/travis/maael/node-ann.svg)](https://travis-ci.org/maael/node-ann)
[![Code Climate](https://img.shields.io/codeclimate/github/maael/node-ann.svg)](https://codeclimate.com/github/maael/node-ann)

A node package implementation of a Artificial Neural Network in JavaScript with Backpropagation learning algorithm.

## Perceptron
```js
    var perceptron = new ann.perceptron({id: 'namedID', bias: '1', type: 'hidden'});
```

## Network
```js
    var network = new ann.ann();
```

### addPerceptron()
```js
    network.addPerceptron(perceptron);
```

### addWeighting()
```js
    network.addWeighting({from: 'u1', to: 'u2', weighting: 1});
```

### getWeightings()
```js
    network.getWeightings();
```

### findPerceptron()
```js
    network.findPerceptron(id);
```