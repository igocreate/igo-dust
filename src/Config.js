

class Config {

  constructor() {
    this.loaded = false;
  }

  load(options) {
    this.cache  = !!options.cache;
    this.views  = options.settings.views || './views';

    // done
    this.loaded = true;
  }

};

module.exports = new Config();