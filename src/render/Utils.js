
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

const FILTERS = {
  e: s => {
    // escape XML
    return s.replace(/[<>&'"]/g, ESCAPE_CHAR);
  },
  uppercase: s => {
    return s.toUpperCase();
  }
};


const _f = (s, f) => {
  // apply filters
  f.split('|').forEach(fi => {
    if (!FILTERS[fi]) {
      return;
    }
    s = FILTERS[fi](s);
  });
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
const s = (l, p, f) => {
  const r = _v(l, p);
  if (!f || typeof r !== 'string') {
    return r;
  }
  return _f(r, f);
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
