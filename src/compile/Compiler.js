

class Compiler {

  constructor() {
    this.fStr = 'let r=\'\';';
  }

  compileBuffer(buffer) {
    buffer.forEach(block => {
      if (block.type === 'r') {
        // reference
        this.fStr += 'r+=u.s(l,\'' + block.tag + '\',\'' + (block.f||'') + '\');';
      } else if (block.type === '?') {
        // conditional block
        this.fStr += 'if(u.b(l,\'' + block.tag + '\')){';
        this.compileBuffer(block.buffer);
        this.fStr += '}';
      } else if (!block.type){
        // default: raw text
        this.fStr += 'r+=\'' + block + '\';';
      }
    });
  }

  compile(buffer) {
    this.compileBuffer(buffer);
    this.fStr += 'return  r;';
    return new Function('l', 'u', this.fStr);
  }

}

module.exports = Compiler;
