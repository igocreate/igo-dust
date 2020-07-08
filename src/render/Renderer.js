
const _         = require('lodash');
const Utils     = require('./Utils');
const Helpers   = require('./Helpers');

const Parser    = require('../parse/Parser');
const Compiler  = require('../compile/Compiler');

class Renderer {
  constructor(customHelpers = {}) {
    this.customHelpers = customHelpers;
  }

  render(str, data) {
    Utils.h.helpers = _.merge(Helpers, this.customHelpers);
    if (typeof str === 'function') {
      return str(data, Utils);
    }
    const buffer  = new Parser().parse(str);
    const fn      = new Compiler().compile(buffer);

    return fn(data, Utils);
  }
}

module.exports = Renderer;
