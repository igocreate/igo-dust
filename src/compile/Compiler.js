
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
        // reference
        this.r += `r+=u.s(${this._getValue(block.tag)}`;
        if (block.f) {
          this.r += `, ${this._getFilters(block.f)}`;
        }
        this.r += ');'
      } else if (block.type === '?' || block.type === '^' ) {
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
        // loop block
        this.i++;
        const { i } = this;
        this.r += `var p_it${i}=l.it;`;
        this.r += `var a${i}=u.a(${this._getValue(block.tag)});`
        this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
        this.r += `l.it=a${i}[i${i}];`;
        this.compileBuffer(block.buffer);
        this.r += '}';
        this.r += `l.it=p_it${i};`;
      }
      else if (block.type === '@') {
        // helper
        this.i++;
        const { i } = this;
        this.r += `var p_it${i}=l.it;`;
        this.r += `var a${i}=u.h('${block.tag}', ${this._getParams(block.params)}, l.it);`
        this.r += `if(a${i}) {`;
        if (block.buffer) {
          this.r += `l.it=a${i};`;
          this.compileBuffer(block.buffer);
        } else {
          `r+='a${i}';`
        }
        this.r += '}';
        if (block.bodies && block.bodies.else) {
          this.r += 'else {';
          this.compileBuffer(block.bodies.else);
          this.r += '}';
        }
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
