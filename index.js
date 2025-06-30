

const Config    = require('./src/Config');
const Cache     = require('./src/Cache');
const Renderer  = require('./src/render/Renderer');
const Helpers   = require('./src/render/Helpers');
const Utils     = require('./src/render/Utils');


// configure igo-dust
module.exports.configure = (options) => {
  Config.configure(options);
};

// compile template
module.exports.compileFile = (filePath) => {
  return Cache.getCompiled(filePath);
};

// get template source
module.exports.getSource = (filePath) => {
  return Cache.getSource(filePath);
};

// render template
module.exports.render = (src, data, stream=null) => {
  return new Renderer().render(src, data, stream);
};

// render template file
module.exports.renderFile = (filePath, data, stream=null) => {
  return new Renderer().renderFile(filePath, data, stream);
};

// expressjs engine
module.exports.engine = (filePath, options, callback) => {
  try {
    const rendered = module.exports.renderFile(filePath, options);
    return callback(null, rendered);
  } catch (err) {
    return callback(err);
  }
};

// Helpers and filters
module.exports.helpers = Helpers;
module.exports.filters = Utils.f;
