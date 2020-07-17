

class Config {

  constructor() {
    this.cache      = false;
    this.views      = './views';
    this.htmlencode = true;
    this.htmltrim   = true;
  }

  load(options) {
    this.once = true;

    this.cache  = !!options.cache;
    this.views  = options.settings.views || this.views;
  }

};

module.exports = new Config();