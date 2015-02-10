# node-ann
[![Build Status](https://img.shields.io/travis/maael/node-ann.svg)](https://travis-ci.org/maael/node-ann)
[![Code Climate](https://img.shields.io/codeclimate/github/maael/node-ann.svg)](https://codeclimate.com/github/maael/node-ann)

A node package implementation of a Artificial Neural Network in JavaScript with Backpropagation learning algorithm.

## Perceptron
```js
    var perceptron = new ann.perceptron({id: 'namedID'});
```

## Layer
```js
    var layer = new ann.layer({type: 'type'});
```

### addPerceptron()
```js
    layer.addPerceptron(perceptron);
```

## Network
```js
    var network = new ann.ann();
```

### addLayer()
```js
    network.addLayer(layer);
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