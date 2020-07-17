
const Cache = require('../Cache');

// special chars
const HCHARS  = /[&<>"']/,
      AMP     = /&/g,
      LT      = /</g,
      GT      = />/g,
      QUOT    = /\"/g,
      SQUOT   = /\'/g;

const BS      = /\\/g,
      FS      = /\//g,
      CR      = /\r/g,
      LS      = /\u2028/g,
      PS      = /\u2029/g,
      NL      = /\n/g,
      LF      = /\f/g,
      SQ      = /'/g,
      DQ      = /"/g,
      TB      = /\t/g;


const htmlencode = (s)=> {
  if (!s.replace || !HCHARS.test(s)) {
    return s;
  }
  return s
      .replace(AMP,'&amp;')
      .replace(LT,'&lt;')
      .replace(GT,'&gt;')
      .replace(QUOT,'&quot;')
      .replace(SQUOT, '&#39;');
};

const escapeJs = (s) => {
  if (typeof s === 'string') {
    return s
      .replace(BS, '\\\\')
      .replace(FS, '\\/')
      .replace(DQ, '\\"')
      .replace(SQ, '\\\'')
      .replace(CR, '\\r')
      .replace(LS, '\\u2028')
      .replace(PS, '\\u2029')
      .replace(NL, '\\n')
      .replace(LF, '\\f')
      .replace(TB, '\\t');
  }
  return s;
};

const stringifyJson = (o) => {
  return JSON.stringify(o)
          .replace(LS, '\\u2028')
          .replace(PS, '\\u2029')
          .replace(LT, '\\u003c');
};

//
const f = {
  h:  htmlencode,
  j:  escapeJs,
  u:  encodeURI,
  uc: encodeURIComponent,
  js: stringifyJson,
  jp: JSON.parse,
  uppercase: (s) => s.toUpperCase(),
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
