
const Tags = require('./Tags');


class Parser {

  constructor() {
    this.buffer = [];
    this.ctx    = { stack: [], buffer: this.buffer };
  }

  parse(str) {

    const openRegexp   = new RegExp('(.*?)' + '\\{', 'g');
    const closeRegexp  = new RegExp('(.*?)' + '\\}', 'g');

    let index = 0;

    let openMatch, closeMatch;
    while ((openMatch = openRegexp.exec(str)) !== null) {
      // console.dir({openMatch});
      if (openMatch[1]) {
        // preceding string
        this.ctx.buffer.push(openMatch[1]);
      }
      index = openMatch.index + openMatch[0].length;

      closeRegexp.lastIndex = index;
      const closeMatch = closeRegexp.exec(str);
      if (!closeMatch) {
        throw new Error('Missing closing tag. index: ' + index);
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
      this.ctx.buffer.push(str.slice(index))
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
        this.ctx.stack.push(block);
        block.buffer    = [];
        this.ctx.buffer = block.buffer;
      } else if (tag.out) {
        // get out
        const prev = this.ctx.stack.pop();
        if (prev && prev.tag !== block.tag) {
          console.error('Open/close tag mismatch!');
        }
        const parent    = this.ctx.stack[this.ctx.stack-1];
        this.ctx.buffer = parent ? parent.buffer : this.buffer;
        block.skip = true;
      }
    } else {
      // reference
      block.type  = 'r';
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
      block.f   = filtersMatch[0].replace(/ /g, '').substring(1);
    };
  }

}

module.exports = Parser;
