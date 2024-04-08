
const Utils     = require('./Utils');
const Cache     = require('../Cache');

const Parser    = require('../parse/Parser');
const Compiler  = require('../compile/Compiler');

class Renderer {

  // render string template
  render(str, data, res) {
    const buffer    = new Parser().parse(str);
    const compiled  = new Compiler().compile(buffer);
    return this.renderCompiled(compiled, data, res);
  }

  // render file template
  renderFile(filePath, data, res) {
    const compiled = Cache.getCompiled(filePath);
    return this.renderCompiled(compiled, data, res);
  }

  // render compiled template
  renderCompiled(compiled, data, res) {
    return compiled(data, Utils, null, res);
  }

}

module.exports = Renderer;
