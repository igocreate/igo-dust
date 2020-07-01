
const SPLIT_CACHE = {};

const _split = (p) => {
  if (!SPLIT_CACHE[p]) {
    SPLIT_CACHE[p] = p.split('.');
  }
  return SPLIT_CACHE[p];
}

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
  if (f.e) { // 'e'
    s = s.replace(/[<>&'"]/g, ESCAPE_CHAR);
  }
  if (f.uppercase) { // 'uppercase'
    s = s.toUpperCase();
  }
  return s;
}

const _v = (l, p) => {
  let r = l;
  const els = _split(p);

  if (els.length === 1) {
    return l[p] || '';
  }
  for (let i = 0; i < els.length; i++) {
    r = r && r[els[i]];
  };
  return r || '';
};

// return boolean
const b = (l, p) => {
  return !!_v(l, p);
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
const a = (l, p) => {
  // return [];
  const r = _v(l, p);
  if (!r || !Array.isArray(r)) {
    return [];
  }
  return r;
};




module.exports = { a, b, s };
