
const TAGS = {
  '?': { in:  true },
  '#': { in:  true },
  '^': { in:  true },
  '@': { in:  true },
  ':': { bodies: true },
  '/': { out: true },
  '>': { root: true },      // layout
  '<': { bodies:  true },   // layout block
}; // TODO: +' ];


module.exports = TAGS;
