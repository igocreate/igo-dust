
const Parser    = require('./src/parse/Parser');
const Compiler  = require('./src/compile/Compiler');
const Renderer  = require('./src/render/Renderer');
const Helpers   = require('./src/render/Helpers');
const FileUtils = require('./src/fs/FileUtils');


const COMPILED_CACHE = {};

//
module.exports.compile = (src) => {
  const buffer  = new Parser().parse(src);
  return new Compiler().compile(buffer);
};

//
module.exports.render = (compiled, data) => {
  return new Renderer().render(compiled, data);
};

const getCompiled = (filePath, options) => {
  // console.dir(options.settings.view.toString());
  if (!options.cache || !COMPILED_CACHE[filePath]) {
    const src = FileUtils.loadFile(filePath);
    COMPILED_CACHE[filePath] = module.exports.compile(src);
  }
  return COMPILED_CACHE[filePath];
}

// expressjs engine
module.exports.engine = (filePath, options, callback) => {
  const compiled = getCompiled(filePath, options);
  const rendered = module.exports.render(compiled, options._locals);
  callback(null, rendered);
};

module.exports.helpers = Helpers;
