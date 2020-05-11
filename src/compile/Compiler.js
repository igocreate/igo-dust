

class Compiler {

  constructor() {
    this.r = `var r='';`;
  }

  compileBuffer(buffer) {
    this.compileBufferFastest(buffer);
    // this.compileBufferSlow(buffer);
  }

  compileBufferFastest(buffer) {
    buffer.forEach(block => {
      if (block.type === 'r') {
        // reference
        this.r += `r+=l.${block.tag};`;
      } else if (block.type === '?') {
        // conditional block
        this.r += `if(l.${block.tag}){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
      } else if (block.type === '#') {
        // loop block
        this.r += `for(var i=0;i<l.${block.tag}.length;i++){`;
        this.r += `l.it=l.${block.tag}[i];`;
        this.compileBuffer(block.buffer);
        this.r += '}';
      } else if (!block.type){
        // default: raw text
        this.r += `r+='${block}';`;
      }
    });
  }

  compileBufferSlow(buffer) {
    buffer.forEach(block => {
      if (block.type === 'r') {
        // reference
        this.r += `r+=u.s(l,'${block.tag}');`;
        // this.r += `r+=u.s(l,'${block.tag}'`;
        // if (block.f) {
        //   this.r += `,'${block.f}'`;
        // }
        // this.r += ');'
      } else if (block.type === '?') {
        // conditional block
        this.r += `if(u.b(l,'${block.tag}')){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
      } else if (block.type === '#') {
        // loop block
        this.r += `var a=u.a(l, '${block.tag}');`
        this.r += `for(var i=0;i<a.length;i++){`;
        this.r += `l.it=a[i];`;
        this.compileBuffer(block.buffer);
        this.r += '}';
      } else if (!block.type){
        // default: raw text
        this.r += `r+='${block}';`;
      }
    });
  }

  compile(buffer) {
    this.compileBuffer(buffer);
    this.r += 'return r;';
    return new Function('l', 'u', this.r);
  }

}

module.exports = Compiler;
