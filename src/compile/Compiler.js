
class Compiler {

  constructor() {
    this.i  =   0;
    this.r  =   `var r='';`;
  }

  compileBuffer(buffer) {

    buffer.forEach(block => {
      // ToDo : if params, add to stack

      if (block.type === 'r') {
        // reference
        this.r += `r+=u.s(${this._getValue(block.tag, block.params)}`;
        if (block.f) {
          this.r += `, ${this._getFilters(block.f)}`;
        }
        this.r += ');'
      } else if (block.type === '<') {
        // insert content
        this.compileBuffer(block.buffer);
      } else if (block.type === '?' || block.type === '^' ) {
        // conditional block
        const not = block.type === '^' ? '!' : '';
        this.r += `if(${not}(${this._getValue(block.tag, block.params)})){`;
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
        this.r += `var a${i}=u.a(${this._getValue(block.tag, block.params)});`
        // Save previous index and length
        this.r += `var p_idx${i} = l.$idx;`;
        this.r += `var p_length${i} = l.$length;`;
        this.r += `l.$length = a${i}.length;`; // current array length
        this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
        this.r += `l.${block.it || 'it'} = a${i}[i${i}];`;
        this.r += `l.$idx = i${i};`; // current id
        this.compileBuffer(block.buffer);
        this.r += '}';
        // Reset previous index and length (it is lost)
        this.r += `l.$idx = p_idx${i};`;
        this.r += `l.$length = p_length${i};`;
      }
      else if (block.type === '@') {
        // helper
        this.i++;
        const { i } = this;
        this.r += `var h${i}=u.h('${block.tag}', ${this._getParams(block.params)}, l.it, l);`
        this.r += `if(h${i}) {`;
        if (block.buffer) {
          this.compileBuffer(block.buffer);
        } else {
          this.r += `r+=h${i};`
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
    return new Function('l', 'u', this.r);
  }

  //
  _getValue(tag, params) {
    const param = params && params[tag];
    if (param && param.type === 's') {
      return `'${param.value}'`;
    }
    if (param && param.type === 'r') {
      tag = param.value;
    }

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
