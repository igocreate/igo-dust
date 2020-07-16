
const fs          = require('fs');
const { resolve } = require('path');

const config      = require('../Config');


// get absolute path
module.exports.getFilePath = (filePath) => {
  if (filePath[0] !== '/' && filePath[0] !== '.') {
    // prefix views folder
    filePath = `${config.views}/${filePath}`;
  }
  return resolve(filePath);
}

//
module.exports.loadFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
}