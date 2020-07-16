
const FileUtils = require('../fs/FileUtils');
const Parser    = require('../parse/Parser');
const Compiler  = require('../compile/Compiler');

class Cache {

  constructor() {
    this._CACHE = {};
  }

  get(key) {
    return this._CACHE[key];
  }

  put(key, value) {
    this._CACHE[key] = value;
  }

  getCompiled(filePath, options) {

    filePath = FileUtils.getFilePath(filePath, options);

    let compiled = this.get(filePath);
    if (compiled) {
      // console.log('igo-dust cache hit: ' + filePath);
      return compiled;
    }

    // load, parse & compile
    const src       = FileUtils.loadFile(filePath);
    const buffer    = new Parser().parse(src);
    compiled        = new Compiler().compile(buffer);
    
    this.put(filePath, compiled);
    return compiled;
  }

};

module.exports = new Cache();