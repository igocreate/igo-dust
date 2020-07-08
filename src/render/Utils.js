

// filters
const HCHARS = /[&<>"']/,
  AMP    = /&/g,
  LT     = /</g,
  GT     = />/g,
  QUOT   = /\"/g,
  SQUOT  = /\'/g;

const escapeHtml = (s) => {
  if (!HCHARS.test(s)) {
    return s;
  }
  return s.replace(AMP,'&amp;').replace(LT,'&lt;').replace(GT,'&gt;').replace(QUOT,'&quot;').replace(SQUOT, '&#39;');
};

const _f = (s, f) => {
  if (f.uppercase) {
    s = s.toUpperCase();
  }
  if (f.e) {
    s = escapeHtml(s);
  }
  return s;
}

// return boolean
const b = (v) => {
  return !!v;
};

// return string, with filter applied
const s = (v, f) => {
  v = v || '';
  if (!f || typeof v !== 'string') {
    return v;
  }
  return _f(v, f);
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

const h = (t, p, c, l) => {
  if (!h.helpers[t]) {
    return null;
  }
  return h.helpers[t](p, c, l);
};

module.exports = { a, b, s, h };
