
const ESCAPE_CHAR = c => {
  switch (c) {
    case '<': return '&lt;';
    case '>': return '&gt;';
    case '&': return '&amp;';
    case '\'': return '&apos;';
    case '"': return '&quot;';
  }
};

const _f = (s, f) => {
  if (f.uppercase) {
    s = s.toUpperCase();
  }
  if (f.e) {
    s = s.replace(/[<>&'"]/g, ESCAPE_CHAR);
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
