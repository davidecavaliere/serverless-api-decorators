// webpack.config.js

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './api/index.ts',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'index.js'
  },
  target: 'node',
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '']
  },
};
