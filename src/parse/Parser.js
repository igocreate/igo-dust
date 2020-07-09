
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

  parse(str, params) {
    // remove spaces at the beginning of lines, line breaks and comment
    str = str.replace(/^\s+/gm, '').replace(/[\r\n]/g , '').replace(/{!.*?!}/g, '');
    
    const openRegexp   = new RegExp('(.*?)\\{', 'msg');
    const closeRegexp  = new RegExp('(.*?)\\}', 'msg');

    let index = 0;

    // find opening '{'
    let openMatch, closeMatch;
    while ((openMatch = openRegexp.exec(str)) !== null) {
      if (openMatch[1]) {
        // preceding string
        this.pushString(openMatch[1]);
      }
      index = openMatch.index + openMatch[0].length;

      // find closing '}'
      let tag = '';
      closeRegexp.lastIndex = index;
      while ((closeMatch = closeRegexp.exec(str)) !== null) {
        tag += closeMatch[1];
        // skip when closing an internal '{'
        if (closeMatch[1].lastIndexOf('{') === -1) {
          break;
        }
        tag += '}';
      }

      if (!closeMatch) {
        // parsing error
        throw new Error('Missing closing }. index: ' + index);
      }

      index = closeMatch.index + closeMatch[0].length;
      openRegexp.lastIndex = index;

      this.parseTag(tag, params);
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
      block.type = 'r';
      block.tag = ParseUtils.replaceByIt(block.tag);
      this.parseFilters(str, block);
      this.pushBlock(block);
      return;
    }

    // set self closing tag
    block.selfClosedTag = str.endsWith('/');

    // remove first char
    block.tag = ParseUtils.parseTag(block.tag);
    
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

  // TODO: rewrite
  parseParams(str, block) {
    
    const params = 

    block.params = ParseUtils.parseParams(str);

    // const arr = str.split(' ');
    // block.tag = ParseUtils.replaceByIt(arr.shift().substring(1));

    // arr.forEach((e, i) => {
    //   if (!e) {
    //     return;
    //   }

    //   if (e === '/' && i === arr.length -1) {
    //     block.selfClosedTag = true;
    //     return ;
    //   }

    //   const s = e.split('=');
    //   if (s.length !== 2) {
    //     // unnamed param
    //     block.param = ParseUtils.cleanStr(e);
    //     return ;
    //   }

    //   const key   = ParseUtils.cleanStr(s[0]);
    //   const type  = s[1][0] === '"' ? 's' : 'r';
    //   let value = ParseUtils.cleanStr(s[1]);

    //   if (key === 'it' && block.type ==='#' && type === 's') {
    //     block.it = value;
    //     return ;
    //   }

    //   if (type === 'r') {
    //     value = ParseUtils.replaceByIt(value);
    //   }
    //   block.params[key] = {type, value};
    // });
  }
}

module.exports = Parser;
