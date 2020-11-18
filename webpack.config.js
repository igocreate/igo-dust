'use strict';

const path = require('path');
const version = require('./package.json').version;
const FileManagerPlugin = require('filemanager-webpack-plugin');


module.exports = exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `igo-dust-${version}-min.js`
  },
  resolve: {
    fallback: {path: false, fs: false}
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: path.join(__dirname, 'dist', `igo-dust-${version}-min.js`),
              destination: path.join(__dirname, 'docs', 'js', 'bundle.js')
            }
          ]
        }
      }
    })
  ]
};