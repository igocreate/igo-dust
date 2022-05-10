
const Utils     = require('./Utils');
const Helpers   = require('./Helpers');

const Parser    = require('../parse/Parser');
const Compiler  = require('../compile/Compiler');

class Renderer {

  render(str, data, res) {
    Utils.h.helpers = Helpers;
    if (typeof str === 'function') {
      return str(data, Utils, null, res);
    }
    const buffer  = new Parser().parse(str);
    const fn      = new Compiler().compile(buffer);

    return fn(data, Utils, null, res);
  }
}

module.exports = Renderer;
