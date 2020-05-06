
const Parser    = require('./src/parse/Parser');
const Compiler  = require('./src/compile/Compiler');
const Renderer  = require('./src/render/Renderer');
const Utils     = require('./src/render/Utils');


module.exports = {
  //
  compile: (src, template) => {
    const buffer  = new Parser().parse(src);
    return new Compiler().compile(buffer);
  },
  //
  render: (template, data) => {
    return new Renderer().render(template, data);
  }
}