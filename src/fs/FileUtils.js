
const fs = require('fs');

//
module.exports.loadFile = (filePath, options) => {
  if (filePath[0] !== '/' && filePath[0] !== '.') {
    // relative
    filePath = './views/' + filePath;
  }
  return fs.readFileSync(filePath + '.dust', 'utf8');
}