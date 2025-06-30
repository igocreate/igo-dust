
const FileUtils = require('./fs/FileUtils');
const Parser    = require('./parse/Parser');
const Compiler  = require('./compile/Compiler');
const config    = require('./Config');

class Cache {

  constructor() {
    this._CACHE = {};
  }

  async _getOrSet(filePath, type, generator) {
    filePath = FileUtils.getFilePath(filePath);
    const cacheKey = `${type}:${filePath}`;
    
    if (config.cache && this._CACHE[cacheKey]) {
      return this._CACHE[cacheKey];
    }

    const result = await generator();
    if (config.cache) {
      this._CACHE[cacheKey] = result;
    }
    return result;
  }

  async _getParsed(filePath) {
    return this._getOrSet(filePath, 'parsed', async () => {
      const src = await FileUtils.loadFile(filePath);
      return new Parser().parse(src);
    });
  }

  async getCompiled(filePath) {
    return this._getOrSet(filePath, 'compiled', async () => {
      const buffer = await this._getParsed(filePath);
      return new Compiler().compile(buffer);
    });
  }

  async getSource(filePath) {
    return this._getOrSet(filePath, 'source', async () => {
      const buffer = await this._getParsed(filePath);
      return new Compiler().toSource(buffer);
    });
  }

};

module.exports = new Cache();
