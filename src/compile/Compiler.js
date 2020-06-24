

class Compiler {

  constructor() {
    this.i  = 0;
    this.r  = `var r='';`;
  }

  compileBuffer(buffer) {
    // this.compileBufferFastest(buffer);
    this.compileBufferSlow(buffer);
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
        this.r += `r+=u.s(l,'${block.tag}'`;
        if (block.f) {
          this.r += `,'${block.f}'`;
        }
        this.r += ');'
      } else if (block.type === '?') {
        // conditional block
        this.r += `if(u.b(l,'${block.tag}')){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
      } else if (block.type === '#') {
        // loop block
        this.i++;
        const { i } = this;
        this.r += `var p_it${i}=l.it;`;
        this.r += `var a${i}=u.a(l, '${block.tag}');`
        this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
        this.r += `l.it=a${i}[i${i}];`;
        this.compileBuffer(block.buffer);
        this.r += '}';
        this.r += `l.it=p_it${i};`;
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
