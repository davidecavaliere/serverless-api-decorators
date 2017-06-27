// webpack.config.js

var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry:
  // './handler.ts',
  {
    api: './api/index.ts',
    handler: './handler.ts'
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'lib'),
    filename: '[name].js'
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
  // externals: [nodeExternals()]
};
