
const Cache = require('../Cache');


// filters
const HCHARS = /[&<>"']/,
      AMP    = /&/g,
      LT     = /</g,
      GT     = />/g,
      QUOT   = /\"/g,
      SQUOT  = /\'/g;

  //
const f = {
  e: (s) => {
    if (!s.replace || !HCHARS.test(s)) {
      return s;
    }
    return s.replace(AMP,'&amp;').replace(LT,'&lt;').replace(GT,'&gt;').replace(QUOT,'&quot;').replace(SQUOT, '&#39;');
  },
  uppercase: (s) => s.toUpperCase()
};

// return boolean
const b = (v) => {
  if (!v) {
    return false;
  }
  if (v.length === 0) {
    return false;
  }
  return true;
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
  return Cache.getCompiled(file + '.dust');
};

module.exports = { a, b, h, f, i };
