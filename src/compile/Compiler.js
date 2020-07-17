

const ParseUtils  = require('../parse/ParseUtils');

class Compiler {

  constructor(options) {
    this.i  =   0;
    this.r  = `var r='',l=l||{},c=c||{};`;
  }

  compileBuffer(buffer) {

    // precompile, for content functions
    buffer.forEach(block => {
      if (block.type === '<') {
        this.r += `c._${block.tag}=function(){var r='';`;
        this.compileBuffer(block.buffer);
        this.r += `return r;};`;
      }
    });

    //
    buffer.forEach(block => {
      if (block.type === 'r') {
        // reference
        this.r += `r+=${this._getReference(block)};`;
      } else if (block.type === '+') {
        // insert content (invoke content function)
        this.r += `if (c._${block.tag})r+=c._${block.tag}();`;
      } else if (block.type === '?' || block.type === '^' ) {
        // conditional block
        const not = block.type === '^' ? '!' : '';
        this._addParamstoLocals(block.params);
        this.r += `if(${not}u.b(${this._getValue(block.tag)})){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
        this._else(block);
        // TODO: clean params from locals
      } else if (block.type === '#') {
        // loop block
        this.i++;
        const { i } = this;
        const it = block.params.it && ParseUtils.stripDoubleQuotes(block.params.it) || 'it';
        this.r += `var a${i}=u.a(${this._getValue(block.tag)});`
        this.r += `if(a${i}) {`;
        if (!block.buffer) {
          this.r += `r+=a${i};`
        } else {
          // Save previous index and length
          this.r += `var p_idx${i}=l.$idx;`;
          this.r += `var p_length${i}=l.$length;`;
          this.r += `l.$length=a${i}.length;`; // current array length
          this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
          this.r += `l.${it}=a${i}[i${i}];`;
          this.r += `l.$idx=i${i};`; // current id
          this.compileBuffer(block.buffer);
          this.r += '}';
          // Reset previous index and length (it is lost)
          this.r += `l.$idx=p_idx${i};`;
          this.r += `l.$length = p_length${i};`;
        }
        this.r += `}`;
        this._else(block);
      } else if (block.type === '@') {
        // helper
        this.i++;
        const { i } = this;
        this.r += `var h${i}=u.h('${block.tag}',${this._getParams(block.params)},l);`
        this.r += `if(h${i}){`;
        if (block.buffer) {
          this.compileBuffer(block.buffer);
        } else {
          this.r += `r+=h${i};`
        }
        this.r += '}';
        this._else(block);
      } else if (block.type === '>') {
        // include
        this._addParamstoLocals(block.params);
        const file = this._getParam(block.file);
        this.r += `r+=u.i(${file})(l,u,c);`;
        // TODO: clean params from locals
      } else if (!block.type){
        // default: raw text
        this.r += `r+='${block}';`;
      }
    });
  }

  //
  compile(buffer) {
    this.compileBuffer(buffer);
    this.r += 'return r;';
    return new Function('l', 'u', 'c', this.r);
  }

  _else(block) {
    if (block.bodies && block.bodies.else) {
      this.r += 'else{';
      this.compileBuffer(block.bodies.else);
      this.r += '}';
    }
  }

  //
  _addParamstoLocals(params) {
    Object.keys(params).forEach(key => {
      if (key === '$') {
        return;
      }
      this.r += `l.${key}=${this._getParam(params[key])};`;
    });
  }

  _getParam(param) {
    if (param[0] === '"') {
      // string
      let ret = [], match, index = 0;

      param = ParseUtils.stripDoubleQuotes(param);

      // replace references in string
      const ref = new RegExp('\\{([^\\}]*)\\}', 'msg');
      while ((match = ref.exec(param)) !== null) {
        // left part
        ret.push(`'${param.substring(index, match.index)}'`);
        index = match.index + match[0].length;
        ret.push(this._getValue(match[1]));
      }
      // final right part
      if (index < param.length) {
        ret.push(`'${param.substring(index, param.length)}'`);
      }
      return ret.join('+');
    }

    if (!isNaN(param)) {
      return param;
    }

    // ref
    return this._getValue(param);
  }

  //
  _getValue(tag) {
    // TEMP / this syntax will be deprecated
    if (tag === '.') {
      return 'l.it';
    }

    if (tag[0] === '.') {
      tag = 'it' + tag;
    }

    let i;
    const ret = [];
    while((i = tag.lastIndexOf('.')) >= 0) {
      ret.unshift(`l.${tag}`);
      tag = tag.substring(0, i);
    }
    ret.unshift(`l.${tag}`);
    const last = ret[ret.length - 1];
    ret[ret.length - 1] = `u.v(${last},l)`;
    return ret.join('&&');
  }

  _getParams(params) {
    let ret = '{';
    for (let key in params) {
      ret += `${key}:${this._getParam(params[key])},`
    }
    ret += '}';
    return ret;
  }

  _getReference(block) {
    let ret = `${this._getValue(block.tag)}||''`;
    if (!block.f) {
      return ret;
    }
    block.f.forEach(f => {
      ret = `u.f.${f}(${ret})`;
    });
    return ret;
  }

}

module.exports = Compiler;
