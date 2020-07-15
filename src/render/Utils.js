
const FileUtils = require('../fs/FileUtils');
const Parser    = require('../parse/Parser');
const Compiler  = require('../compile/Compiler');

// filters
const HCHARS = /[&<>"']/,
  AMP    = /&/g,
  LT     = /</g,
  GT     = />/g,
  QUOT   = /\"/g,
  SQUOT  = /\'/g;

const f = {
  e: (s) => {
    if (!s.replace || !HCHARS.test(s)) {
      return s;
    }
    return s.replace(AMP,'&amp;').replace(LT,'&lt;').replace(GT,'&gt;').replace(QUOT,'&quot;').replace(SQUOT, '&#39;');
  },
  u: (s) => s.toUpperCase()
};

// return array
const a = (v) => {
  if (Array.isArray(v)) {
    return v;
  }
  if (v) {
    return [v];
  }
  return null;
};

// helpers
const h = (t, p, l) => {
  if (!h.helpers || !h.helpers[t]) {
    return null;
  }
  return h.helpers[t](p, l);
};

// include file
const i = (file) => {
  const str     = FileUtils.loadFile(file);
  const buffer  = new Parser().parse(str);
  const fn      = new Compiler().compile(buffer);
  return fn;
};

module.exports = { a, h, f, i };
