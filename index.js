
const Parser    = require('./src/parse/Parser');
const Compiler  = require('./src/compile/Compiler');
const Renderer  = require('./src/render/Renderer');
const Helpers   = require('./src/render/Helpers');
const FileUtils = require('./src/fs/FileUtils');
const CACHE     = require('./src/cache/Cache');

//
module.exports.compile = (src) => {
  const buffer  = new Parser().parse(src);
  return new Compiler().compile(buffer);
};

//
module.exports.render = (compiled, data) => {
  return new Renderer().render(compiled, data);
};

// expressjs engine
module.exports.engine = (filePath, options, callback) => {
  // console.dir(options.settings.view.toString());
  
  const compiled = CACHE.getCompiled(filePath, options);
  const rendered = module.exports.render(compiled, options._locals);
  callback(null, rendered);
};

module.exports.helpers = Helpers;
