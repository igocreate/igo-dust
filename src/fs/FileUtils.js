
const fs          = require('fs');
const { resolve } = require('path');


// get absolute path
module.exports.getFilePath = (filePath, options) => {
  if (filePath[0] !== '/' && filePath[0] !== '.') {
    // prefix views folder
    filePath = './views/' + filePath;
  }
  return resolve(filePath);
}

//
module.exports.loadFile = (filePath, options) => {
  return fs.readFileSync(filePath, 'utf8');
}