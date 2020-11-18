'use strict';

const path = require('path');

module.exports = exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'igo-dust.bundle.js'
  },
  resolve: {
    fallback: { path: false, fs: false}
  }
};