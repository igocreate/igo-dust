const FileUtils = require('./fs/FileUtils');
const Parser    = require('./parse/Parser');
const Compiler  = require('./compile/Compiler');
const config    = require('./Config');

class Cache {

  constructor() {
    this._CACHE = {};
  }

  _getOrSet(filePath, type, generator) {
    filePath = FileUtils.getFilePath(filePath);
    const cacheKey = `${type}:${filePath}`;
    
    if (config.cache && this._CACHE[cacheKey]) {
      return this._CACHE[cacheKey];
    }

    const result = generator();
    if (config.cache) {
      this._CACHE[cacheKey] = result;
    }
    return result;
  }

  _getParsed(filePath) {
    return this._getOrSet(filePath, 'parsed', () => {
      const src = FileUtils.loadFile(filePath);
      return new Parser().parse(src);
    });
  }

  getCompiled(filePath) {
    return this._getOrSet(filePath, 'compiled', () => {
      const buffer = this._getParsed(filePath);
      return new Compiler().compile(buffer);
    });
  }

  getSource(filePath) {
    return this._getOrSet(filePath, 'source', () => {
      const buffer = this._getParsed(filePath);
      return new Compiler().toSource(buffer);
    });
  }

};

module.exports = new Cache();