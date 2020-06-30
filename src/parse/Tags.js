
const TAGS = {
  '?': { in:  true },
  '#': { in:  true },
  '^': { in:  true },
  ':': { bodies: true },
  '/': { out: true }
}; // TODO: '^', ':', '@', '<', '+' ];


module.exports = TAGS;
