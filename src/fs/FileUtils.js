
const fs = require('fs');

//
module.exports.loadFile = (filePath, options) => {
  return fs.readFileSync(filePath, 'utf8');
}