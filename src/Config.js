

class Config {

  constructor() {
    this.cache      = false;
    this.views      = './views';
    this.htmlencode = true;
    this.htmltrim   = true;
  }

  configure(settings) {

    if (settings['view cache'] !== undefined) {
      this.cache = !!settings['view cache'];
    }
    if (settings.views !== undefined) {
      this.views = !!settings.views;
    }
    ['htmlencode', 'htmltrim', 'cache'].forEach((key) => {
      if (settings[key] !== undefined) {
        this[key] = !!settings[key];
      }
    });

  }

};

module.exports = new Config();