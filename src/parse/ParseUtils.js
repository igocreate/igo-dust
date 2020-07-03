

// remove spaces and double quotes
module.exports.cleanStr = (s) => {
  const regexp = /["]*(.[^"]*)/;
  const match  = regexp.exec(s);
  return match && match[1];
}