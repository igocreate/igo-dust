
const Tags = require('./Tags');


class Parser {

  constructor() {
    this.buffer = [];
    this.ctx    = { stack: [], buffer: this.buffer };
  }

  push(str) {
    str = str.replace(/[\r\n]/gm, '');
    str = str.replace(/'/g, '\\\'');
    this.ctx.buffer.push(str);
  }

  parse(str) {

    const openRegexp   = new RegExp('(.*?)\\{', 'msg');
    const closeRegexp  = new RegExp('(.*?)\\}', 'msg');

    let index = 0;

    let openMatch, closeMatch;
    while ((openMatch = openRegexp.exec(str)) !== null) {
      if (openMatch[1]) {
        // preceding string
        // console.dir({openMatch});
        this.push(openMatch[1]);
      }
      index = openMatch.index + openMatch[0].length;

      closeRegexp.lastIndex = index;
      const closeMatch = closeRegexp.exec(str);
      
      if (!closeMatch) {
        throw new Error('Missing closing }. index: ' + index);
      }
      index = closeMatch.index + closeMatch[0].length;
      openRegexp.lastIndex = index;
      const b = this.ctx.buffer; // parseTag can change the buffer
      const block = this.parseTag(closeMatch[1]);
      if (!block.skip) {
        b.push(block);
      }

    }

    if (index < str.length) {
      this.push(str.slice(index))
    }

    // console.log('--- done parsing');
    // console.dir(this.buffer);
    return this.buffer;
  }

  parseTag(str) {
    const block = { tag: str, str };

    const tag = Tags[str[0]];

    if (tag) {
      // special block
      block.type  = str[0];
      block.tag   = block.tag.substring(1);
      if (tag.in) {
        // get in
        // console.log('get in');
        this.ctx.stack.push(block);
        block.buffer    = [];
        this.ctx.buffer = block.buffer;
      } else if (tag.out) {
        // get out
        // console.log('get out');
        const prev = this.ctx.stack.pop();
        if (prev && prev.tag !== block.tag) {
          console.error('Open/close tag mismatch!');
        }
        const parent    = this.ctx.stack[this.ctx.stack.length-1];
        this.ctx.buffer = parent ? parent.buffer : this.buffer;
        block.skip = true;
      } else if (tag.bodies) {
        // alternative buffer in current block bodies
        const current   = this.ctx.stack[this.ctx.stack.length - 1];
        current.bodies  = current.bodies || {};
        current.bodies[block.tag] = [];
        this.ctx.buffer = current.bodies[block.tag];
        block.skip = true;
      }
    } else {
      // reference
      block.type  = 'r';
      if (block.tag === '.') {
        block.tag = 'it';
      }
      //block.tag = block.tag.replace(/^\./, 'it');
      this.parseFilters(str, block);

    }

    // console.dir({block});
    return block;
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

}

module.exports = Parser;
