'use strict';

const path = require('path');
const version = require('./package.json').version;

module.exports = exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `igo-dust-${version}-min.js`
  },
  resolve: {
    fallback: { path: false, fs: false}
  }
};