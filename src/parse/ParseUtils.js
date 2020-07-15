

// remove spaces and double quotes
module.exports.cleanStr = (s) => {
  const regexp = /["]*(.[^"]*)/;
  const match  = regexp.exec(s);
  return match && match[1];
};

// remove spaces and double quotes
module.exports.stripDoubleQuotes = (s) => {
  const regexp = new RegExp('"', 'sg');
  return s.replace(regexp, '');
};

// 
module.exports.parseTag = (s) => {
  const i = s.indexOf(' ');
  if (i >= 0) {
    s = s.substring(0, i);
  }
  return s.substring(1);
};

//
module.exports.parseParams = (s) => {
  const params = {};
  
  let match;
  
  // string param
  const stringParam = new RegExp('(\\w+)=("[^="]*")', 'msg');
  while ((match = stringParam.exec(s)) !== null) {
    params[match[1]] = match[2];
  }

  // ref param
  const refParam = new RegExp('(\\w+)=([^" ]+)', 'msg');
  while ((match = refParam.exec(s)) !== null) {
    params[match[1]] = match[2];
  }

  // unnamed string param
  const unnamedStringParam = new RegExp('[^=] ("[^="]*")', 'msg');
  if ((match = unnamedStringParam.exec(s)) !== null) {
    params.$ = match[1];
  }
  return params;
};