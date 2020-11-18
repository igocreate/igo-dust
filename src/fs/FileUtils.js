
const fs      = require('fs');
const path    = require('path');

const config  = require('../Config');


// get absolute path
module.exports.getFilePath = (filePath) => {
  if (!path.isAbsolute(filePath) && filePath[0] !== '.') {
    // prefix views folder
    filePath = `${config.views}/${filePath}`;
  }
  return path.resolve(filePath);
};

//
module.exports.loadFile = (filePath) => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
};
