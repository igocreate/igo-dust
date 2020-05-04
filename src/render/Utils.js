
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
  f = f ? f.split('|') : [];
  // add default escapexml filter
  if (f.indexOf('s') < 0 && f.indexOf('e') < 0) {
    f.push('e');
  }

  // apply filters
  f.forEach(fi => {
    if (!FILTERS[fi]) {
      return;
    }
    s = FILTERS[fi](s);
  });
  return s;
}

const _v = (l, p) => {
  let r = l;
  p.split('.').forEach(a => {
    if (!r) {
      return;
    }
    r = r[a];
  });
  return r;
};

// return boolean
const b = (l, p) => {
  return !!_v(l, p);
};

// return string, with filter applied
const s = (l, p, f) => {
  const r = _v(l, p);
  if (r === undefined || r === null) {
    return '';
  }
  return _f(r, f);
};




module.exports = { b, s };
