

const config    = require('./src/Config');
const Renderer  = require('./src/render/Renderer');
const Helpers   = require('./src/render/Helpers');
const Utils     = require('./src/render/Utils');


// configure igo-dust
module.exports.configure = (options) => {
  config.configure(options);
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
module.exports.engine = (filePath, data, callback) => {
  const rendered = module.exports.renderFile(filePath, data);
  if (!callback) {
    return rendered;
  }
  callback(null, rendered);
};

// Helpers and filters
module.exports.helpers = Helpers;
module.exports.filters = Utils.f;
