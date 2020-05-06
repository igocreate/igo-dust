

const Utils     = require('./Utils');

const Parser    = require('../parse/Parser');
const Compiler  = require('../compile/Compiler');


class Renderer {
  constructor() {

  }

  render(str, data) {
    if (typeof str === 'function') {
      return str(data, Utils);
    }
    const buffer  = new Parser().parse(str);
    const fn      = new Compiler().compile(buffer);
    return fn(data, Utils);
  }
}

module.exports = Renderer;
