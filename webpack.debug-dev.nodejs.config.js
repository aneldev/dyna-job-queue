// help: http://webpack.github.io/docs/configuration.html
// help: https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

console.log('DEBUG with devtools in nodeJs ');
console.log('WARNING: you should run the `npm run debug-tests-build` in order to debug your latest changes!');

const config = {
  target: 'node', // help: https://webpack.github.io/docs/configuration.html#target
  entry: [
    'babel-polyfill',
    // the entry application code
    path.resolve(__dirname, 'dev/index.ts')
  ],
  externals: [],
  output: {
    path: path.resolve(__dirname, 'debug-ground/debug-dev-on-nodejs'),
    filename: 'index.js'
  },
  resolve: {
    alias: {},
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    loaders: loaders
  },
  node: {
    fs: "empty"
  },
  plugins: plugins,
};

module.exports = config;
