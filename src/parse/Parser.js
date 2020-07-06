
const ParseUtils  = require('./ParseUtils');
const Tags        = require('./Tags');

const FileUtils = require('../fs/FileUtils');



class Parser {

  constructor() {
    this.global     = [];           // global buffer, to be returned by parse function
    this.buffer     = this.global;  // current buffer, where content is added
    this.stack      = [];           // stack of parents blocks
    this.contents   = {};           // contents to be replaced in layouts
  }

  // add string
  pushString(str) {
    // escape string
    str = str.replace(/[\r\n]/gm, '\\r\\n');  // escape linebreaks
    str = str.replace(/'/g, '\\\'');          // escape single quotes
    // push
    this.buffer.push(str);
  }

  // push block
  pushBlock(block) {
    this.buffer.push(block);
  }

  // stack the block, use its buffer as current
  stackBlock(block)  {
    block.buffer  = [];
    this.buffer   = block.buffer;
    this.stack.push(block);
  }

  getLastBlock() {
    return this.stack[this.stack.length-1];
  }

  pop() {
    const block = this.stack.pop();
    const last  = this.getLastBlock();
    this.buffer = last && last.buffer || this.global;
    return block;
  }

  addBody(tag) {
    const last = this.getLastBlock();
    if (!last) {
      throw new Error('Cannot add body outside of a block');
    }
    last.bodies       = last.bodies || {};
    last.bodies[tag]  = [];
    this.buffer       = last.bodies[tag];
  }

  addContent(block) {
    // this.contents[block.tag] = block;
    // replace
    for (let i = 0; i < this.buffer.length; i++) {
      const b = this.buffer[i];
      if (b.type === '+' && b.tag === block.tag) {
        // replace
        this.buffer.splice(i, 1, block);
      }
    }
  }

  include(file, params) {
    const src     = FileUtils.loadFile(file + '.dust');
    const buffer  = new Parser().parse(src, params);
    // push all buffer items in this.buffer
    Array.prototype.push.apply(this.buffer, buffer);
  }

  parse(str, params) {

    const openRegexp   = new RegExp('(.*?)\\{', 'msg');
    const closeRegexp  = new RegExp('(.*?)\\}', 'msg');

    let index = 0;

    let openMatch, closeMatch;
    while ((openMatch = openRegexp.exec(str)) !== null) {
      if (openMatch[1]) {
        // preceding string
        this.pushString(openMatch[1]);
      }
      index = openMatch.index + openMatch[0].length;

      closeRegexp.lastIndex = index;
      const closeMatch = closeRegexp.exec(str);
      
      if (!closeMatch) {
        // parsing error
        throw new Error('Missing closing }. index: ' + index);
      }

      index = closeMatch.index + closeMatch[0].length;
      openRegexp.lastIndex = index;

      this.parseTag(closeMatch[1], params);
    }

    if (index < str.length) {
      this.pushString(str.slice(index))
    }

    // console.log('--- done ---');
    // console.dir(this);
    return this.global;
  }

  parseTag(str, params = {}) {

    const tag = Tags[str[0]];

    const block = {
      type: str[0],
      tag:  str,
      params,
    };

    if (!tag) {
      // reference
      block.type  = 'r';

      // if (block.tag === '.') {
      //   block.tag = 'it';
      // }
      this.parseFilters(str, block);
      this.pushBlock(block);
      return;
    }
    
    // parse params
    this.parseParams(str, block);

    // apply tag
    tag(this, block);
  }

  parseFilters(str, block) {
    // parse filters
    const filtersRegexp = new RegExp('([ ]*\\|[ ]*\\w+)+', 'g');
    const filtersMatch  = filtersRegexp.exec(str);
    if (filtersMatch) {
      block.tag = str.substring(0, filtersMatch.index);
      const f   = filtersMatch[0].replace(/ /g, '').substring(1).split('|');
      const s   = f.indexOf('s');
      if (s > -1) {
        f.splice(s, 1);
      } else {
        f.push('e');
      }
      block.f = f.join('|');
    } else {
      block.f = 'e';
    }
  }

  parseParams(str, block) {
    const arr = str.split(' ');
    block.tag = arr.shift().substring(1);

    arr.forEach((e, i) => {
      if (!e) {
        return;
      }

      if (e === '/' && i === arr.length -1) {
        block.selfClosedTag = true;
        return ;
      }

      // unnamed param
      block.params[i] = ParseUtils.cleanStr(e);
      
      const s = e.split('=');
      if (s.length !== 2) {
        return ;
      }
      const key   = ParseUtils.cleanStr(s[0]);
      const type  = s[1][0] === '"' ? 's' : 'r';
      const value = ParseUtils.cleanStr(s[1]);

      block.params[key] = {type, value};
    });
  }
}

module.exports = Parser;
