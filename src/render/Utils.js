

// filters
const HCHARS = /[&<>"']/,
  AMP    = /&/g,
  LT     = /</g,
  GT     = />/g,
  QUOT   = /\"/g,
  SQUOT  = /\'/g;

const f = {
  'e': (s) => {
    if (!HCHARS.test(s)) {
      return s;
    }
    return s.replace(AMP,'&amp;').replace(LT,'&lt;').replace(GT,'&gt;').replace(QUOT,'&quot;').replace(SQUOT, '&#39;');
  },
  'u': (s) => s.toUpperCase()
};

// return array
const a = (v) => {
  if (Array.isArray(v)) {
    return v;
  }
  if (v) {
    return [v];
  }
  return [];
};

// helpers
const h = (t, p, c, l) => {
  if (!h.helpers[t]) {
    return null;
  }
  return h.helpers[t](p, c, l);
};

module.exports = { a, h, f };
