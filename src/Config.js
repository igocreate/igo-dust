

class Config {

  constructor() {
    this.cache      = false;
    this.views      = './views';
    this.htmlencode = true;
    this.htmltrim   = true;
  }

  init(settings) {
    this._settings  = settings;
    this.cache      = settings['view cache'];
    this.views      = settings.views || this.views;
  }

};

module.exports = new Config();