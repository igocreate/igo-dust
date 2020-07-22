

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
        this.r += `if (c._${block.tag}){r+=c._${block.tag}();}`;
      } else if (block.type === '?' || block.type === '^' ) {
        // conditional block
        const not = block.type === '^' ? '!' : '';
        this._addParamsToLocals(block.params);
        this.r += `if(${not}u.b(${this._getValue(block.tag)})){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
        this._else(block);
        this._cleanParamsFromLocals(block.params);
      } else if (block.type === '#') {
        // loop block
        this.i++;
        const { i } = this;
        const it = block.params.it && ParseUtils.stripDoubleQuotes(block.params.it) || 'it';
        this._addParamsToLocals(block.params);
        this.r += `var a${i}=u.a(${this._getValue(block.tag)});`
        this.r += `if(a${i}){`;
        if (!block.buffer) {
          this.r += `r+=a${i};`
        } else {
          // Save previous it, index and length
          this.r += `c.p_it${i}=l.it;`;
          this.r += `c.p_idx${i}=l.$idx;`;
          this.r += `c.p_length${i}=l.$length;`;
          this.r += `l.$length=a${i}.length;`; // current array length
          this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
          this.r += `l.${it}=a${i}[i${i}];`;
          this.r += `l.$idx=i${i};`; // current id
          this.compileBuffer(block.buffer);
          this.r += '}';
          // Reset previous index and length
          this.r += `l.it=c.p_it${i};`;
          this.r += `l.$idx=c.p_idx${i};`;
          this.r += `l.$length=c.p_length${i};`;
        }
        this.r += `}`;
        this._else(block);
        this._cleanParamsFromLocals(block.params);
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
        this._addParamsToLocals(block.params);
        const file = this._getParam(block.file);
        this.r += `r+=u.i(${file})(l,u,c);`;
        this._cleanParamsFromLocals(block.params);
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
    // console.log(this.r);
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
  _addParamsToLocals(params) {
    const { i } = this;
    Object.keys(params).forEach(key => {
      if (key === '$') {
        return;
      }
      this.r += `c.p_${key}${i}=l.${key};`;
      this.r += `l.${key}=${this._getParam(params[key])};`;
    });
  }

  //
  _cleanParamsFromLocals(params) {
    const { i } = this;
    Object.keys(params).forEach(key => {
      if (key === '$') {
        return;
      }
      this.r += `l.${key}=c.p_${key}${i};`;
      this.r += `delete c.p_${key}${i};`;
    });
  }

  _getParam(param) {
    if (param[0] === '"') {
      // string
      let ret = [], match, index = 0, s;

      param = ParseUtils.stripDoubleQuotes(param);

      // replace references in string
      const ref = new RegExp('\\{([^\\}]*)\\}', 'msg');
      while ((match = ref.exec(param)) !== null) {
        // left part
        ret.push(`'${param.substring(index, match.index)}'`);
        index = match.index + match[0].length;
        ret.push(`(${this._getValue(match[1])}||'')`);
      }
      // final right part
      if (index < param.length) {
        s = param.substring(index, param.length);
        // escape single quotes
        s = s.replace(/'/g, '\\\'');
        ret.push(`'${s}'`);
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

    if (!isNaN(tag)) {
      return tag;
    }

    if (tag[0] === '.') {
      tag = 'it' + tag;
    }

    const elements = [];
    let i, c, sub = false, idx = 0;
    // parse ref
    for (i = 0; i < tag.length; i++) {
      c = tag[i];
      if (!sub && (c === '.' || c === '[')) {
        if (i > idx) {
          elements.push(tag.substring(idx, i));
        }
        idx = i + 1;
        sub = (c === '[');
      } else if (c === ']') {
        elements.push('[' + this._getValue(tag.substring(idx, i)) + ']');
        sub = false;
        idx = i + 1;
      }
    }

    // last part
    if (i > idx) {
      elements.push(tag.substring(idx, i));
    }

    // build string
    let current = 'l', ret = [];
    elements.forEach((element) => {
      if (element[0] === '[') {
        current += element;
      } else {
        current += '.' + element;
      }
      ret.push(current);
    });

    // use u.v to invoke function on last element
    if (ret.length === 1) {
      return `u.v(${ret[0]},null,l)`;
    }
    const last  = ret[ret.length - 1];
    const _this = ret[ret.length - 2];
    ret[ret.length - 1] = `u.v(${last},${_this},l)`;

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
    let ret = `(${this._getValue(block.tag)}||'')`;
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
