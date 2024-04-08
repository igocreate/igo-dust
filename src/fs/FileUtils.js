

const {isBrowser, isNode} = require('./../environment');
const config              = require('../Config');
const path                = require('path');
const fs                  = require('fs');

// get absolute path
module.exports.getFilePath = (filePath) => {
  if (isBrowser) {
    console.error('not implemented for browser'); 
    return '';
  }

  if (!path.isAbsolute(filePath) && filePath[0] !== '.') {
    // prefix views folder
    filePath = `${config.views}/${filePath}`;
  }
  return path.resolve(filePath);
};

//
module.exports.loadFile = (filePath) => {
  if (isBrowser) {
    console.error('not implemented for browser');
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
};
