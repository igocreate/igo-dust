
class Compiler {

  constructor() {
    this.i  = 0;
    this.r  = `var r='';`;
    this.r  += `var ctx={stack: []};`;
    this.r  += `l.it = l;`;
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
      } else if (block.type === '?' || block.type === '^' ) {
        // conditional block
        this.r += `if(${block.type === '^' ? '!' : ''}(l.${block.tag})){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
        // else
        if (block.bodies && block.bodies.else) {
          this.r += 'else {';
          this.compileBuffer(block.bodies.else);
          this.r += '}';
        }
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
        this.r += `l.it=ctx.stack[ctx.stack.length - 1];`;
        // reference
        this.r += `r+=u.s(${this._getValue(block.tag)}`;
        if (block.f) {
          this.r += `, ${this._getFilters(block.f)}`;
        }
        this.r += ');'
      } else if (block.type === '?' || block.type === '^' ) {
        this.r += `l.it=ctx.stack[ctx.stack.length - 1];`;
        // conditional block
        const not = block.type === '^' ? '!' : '';
        this.r += `if(${not}(${this._getValue(block.tag)})){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
        // else
        if (block.bodies && block.bodies.else) {
          this.r += 'else{';
          this.compileBuffer(block.bodies.else);
          this.r += '}';
        }
      } else if (block.type === '#') {
        this.r += `l.it=ctx.stack[ctx.stack.length - 1];`;
        // loop block
        this.i++;
        const { i } = this;
        this.r += `var a${i}=u.a(${this._getValue(block.tag)});`
        this.r += `ctx.stack.push(a${i});`;
        this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
        this.r += `ctx.stack.push(a${i}[i${i}]);`;
        this.r += `ctx.index = i${i};`;
        this.compileBuffer(block.buffer);
        this.r += `ctx.stack.pop();`;
        this.r += '}';
        this.r += `ctx.index = null;`;
        this.r += `ctx.stack.pop();`;
      }
      else if (block.type === '@') {
        // helper
        this.r += `l.it=ctx.stack[ctx.stack.length - 1];`;
        this.i++;
        const { i } = this;
        this.r += `var h${i}=u.h('${block.tag}', ${this._getParams(block.params)}, ctx);`
        this.r += `if(h${i}) {`;
        if (block.buffer) {
          this.r += `ctx.stack.push(h${i});`;
          this.compileBuffer(block.buffer);
          this.r += `ctx.stack.pop();`;
        } else {
          `r+='h${i}';`
        }
        this.r += '}';
        if (block.bodies && block.bodies.else) {
          this.r += 'else {';
          this.compileBuffer(block.bodies.else);
          this.r += '}';
        }
      } else if (!block.type){
        // default: raw text
        this.r += `r+='${block}';`;
      }
    });
  }

  compile(buffer) {
    this.compileBuffer(buffer);
    this.r += 'return r;';
    return new Function('l = {}', 'u', this.r);
  }

  //
  _getValue(tag) {
    let i;
    const ret = [];
    while((i = tag.lastIndexOf('.')) >= 0) {
      ret.unshift(`l.${tag}`);
      tag = tag.substring(0, i);
    }
    ret.unshift(`l.${tag}`);
    return ret.join('&&');
  }

  _getParams(params) {
    let ret = '{';
    let value;
    for (let key in params) {
      if (params[key].type === 'r') {
        value = this._getValue(params[key].value);
      } else {
        value = `'${params[key].value}'`;
      }
      ret += `${key}:${value},`
    }
    ret += '}';
    return ret;
  }

  _getFilters(filters) {
    filters = filters.split('|');
    return `{'${filters.join(`':true,'`)}':true}`;
  }
}

module.exports = Compiler;
