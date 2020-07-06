

// remove spaces and double quotes
module.exports.cleanStr = (s) => {
  const regexp = /["]*(.[^"]*)/;
  const match  = regexp.exec(s);
  return match && match[1];
};

// replace first "." by "it"
module.exports.replaceByIt = (s) => {
  if (s === '.') {
    return 'it';
  } else if (s[0] === '.') {
    return 'it' + s;
  }
  return s;
};
