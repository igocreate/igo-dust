
const Parser    = require('./src/parse/Parser');
const Compiler  = require('./src/compile/Compiler');
const Renderer  = require('./src/render/Renderer');
const Helpers   = require('./src/render/Helpers');
const FileUtils = require('./src/fs/FileUtils');
const CACHE     = require('./src/cache/Cache');
const config    = require('./src/Config');

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
  if (!config.loaded) {
    config.load(options);
  }
  const compiled = CACHE.getCompiled(filePath);
  const rendered = module.exports.render(compiled, options);
  callback(null, rendered);
};

module.exports.helpers = Helpers;
