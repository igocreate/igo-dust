

class Compiler {

  constructor() {
    this.fStr = `var r='';`;
  }

  compileBuffer(buffer) {
    buffer.forEach(block => {
      if (block.type === 'r') {
        // reference
        this.fStr += `r+=u.s(l,'${block.tag}'`;
        if (block.f) {
          this.fStr += `,'${block.f}'`;
        }
        this.fStr += ');'
      } else if (block.type === '?') {
        // conditional block
        this.fStr += `if(u.b(l,'${block.tag}')){`;
        this.compileBuffer(block.buffer);
        this.fStr += '}';
      } else if (block.type === '#') {
        // loop block
        this.fStr += 'u.a(l,\'' + block.tag + '\').forEach(function(it){';
        this.fStr += 'l.it=it;';
        this.compileBuffer(block.buffer);
        this.fStr += '});';
      } else if (!block.type){
        // default: raw text
        this.fStr += `r+='${block}';`;
      }
    });
  }

  compile(buffer) {
    this.compileBuffer(buffer);
    this.fStr += 'return r;';
    return new Function('l', 'u', this.fStr);
  }

}

module.exports = Compiler;
