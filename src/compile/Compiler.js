

const ParseUtils  = require('../parse/ParseUtils');

class Compiler {

  constructor() {
    this.i  =   0;
    this.r  = `var r='',l=l||{},c=c||{ctx:[]};`;
    this.r += 'var a=s?function(x){s.write(String(x))}:function(x){r+=x};';
  }

  compileBuffer(buffer) {
    // precompile, for content functions
    buffer.forEach(block => {
      if (block.type === '<') {
        this.r += `c._${block.tag}=async function(){var r='';`;
        this.r += 'var a=s?function(x){s.write(String(x))}:function(x){r+=x};';
        this.compileBuffer(block.buffer);
        this.r += 'return r;};';
      }
    });

    //
    buffer.forEach(block => {
      if (block.type === 'r') {
        // reference
        this.r += `a(${this._getReference(block)});`;
      } else if (block.type === '+' && !block.tag) {
        // insert body (invoke content function)
        this.r += `if(c._$body){a(await c._$body());c._$body=null;}`;
      } else if (block.type === '+') {
        // insert content (invoke content function)
        this.r += `if(c._${block.tag}){a(await c._${block.tag}())}`;
        if (block.buffer) {
          this.r += 'else{';
          this.compileBuffer(block.buffer);
          this.r += '}';
        }
      } else if (block.type === '?' || block.type === '^' ) {
        // conditional block
        const not = block.type === '^' ? '!' : '';
        this._pushContext(block.params);
        this.r += `if(${not}u.b(${this._getValue(block.tag)})){`;
        this.compileBuffer(block.buffer);
        this.r += '}';
        this._else(block);
        this._popContext(block.params);
      } else if (block.type === '#') {
        // loop block
        this.i = this.i + 1;
        const { i } = this;
        this._pushContext(block.params, true);
        this.r += `var a${i}=u.a(${this._getValue(block.tag)});`;
        this.r += `if(a${i}){`;
        if (!block.buffer) {
          this.r += `a(a${i})`;
        } else {
          const it = block.params.it && ParseUtils.stripDoubleQuotes(block.params.it);
          this.r += `l.$length=a${i}.length;`; // current array length
          this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
          if (it) {
            this.r += `l.${it}=a${i}[i${i}];`;
          }
          this.r += `l._it=a${i}[i${i}];`;
          this.r += `l.$idx=i${i};`; // current id
          this.compileBuffer(block.buffer, true);
          this.r += '}';
        }
        this.r += '}';
        this._else(block);
        this._popContext(block.params, true);
      } else if (block.type === '@') {
        // helper
        this.i = this.i + 1;
        const { i } = this;
        this.r += `var h${i}=u.h('${block.tag}',${this._getParams(block.params)},l);`;
        this.r += `if(h${i}){`;
        if (block.buffer) {
          this.compileBuffer(block.buffer);
        } else {
          this.r += `a(h${i});`;
        }
        this.r += '}';
        this._else(block);
      } else if (block.type === '>') {
        // include

        // precompile if buffer
        if (block.buffer) {
          this.r += `c._$body=async function(){var r='';`;
          this.r += 'var a=s?function(x){s.write(String(x))}:function(x){r+=x};';
          this.compileBuffer(block.buffer);
          this.r += 'return r;};';
        }

        this._pushContext(block.params);
        const file = this._getParam(block.file);
        this.r += `a(await (await u.i(${file}))(l,u,c,s));`;
        this._popContext(block.params);
      } else if (!block.type){
        // default: raw text
        this.r += `a('${block}');`;
      }
    });
  }

  // Generates the template function source code
  toSource(buffer) {
    this.compileBuffer(buffer);
    this.r += 'return r;';
    return this.r;
  }

  // Compiles the template into an executable function
  compile(buffer) {
    const sourceCode = this.toSource(buffer);
    // console.log(sourceCode);
    return new (Object.getPrototypeOf(async function(){}).constructor)('l', 'u', 'c', 's', sourceCode);
  }

  _else(block) {
    if (block.bodies && block.bodies.else) {
      this.r += 'else{';
      this.compileBuffer(block.bodies.else);
      this.r += '}';
    }
  }

  _pushContext(params, isArray) {
    const { i } = this;
    this.r += `var ctx${i}={};`; 
    Object.keys(params).forEach(key => {
      if (key === '$') {
        return;
      }
      this.r += `ctx${i}.${key}=l.${key};`;
      this.r += `l.${key}=${this._getParam(params[key])};`;
    });
    if (isArray) {
      this.r += `ctx${i}._it=l._it;`;
      this.r += `ctx${i}.idx=l.$idx;`;
      this.r += `ctx${i}.length=l.$length;`;
    }

    this.r += `c.ctx.push(ctx${i});`;
  }

  _popContext(params, isArray) {
    const { i } = this;
    this.r += `var p_ctx${i}=c.ctx.pop();`;
    Object.keys(params).forEach(key => {
      if (key === '$') {
        return;
      }
      this.r += `l.${key}=p_ctx${i}.${key};`;
    });
    if (isArray) {
      this.r += `l._it=p_ctx${i}._it;`;
      this.r += `l.$idx=p_ctx${i}.idx;`;
      this.r += `l.$length=p_ctx${i}.length;`;
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
      if (!param) {
        // empty string
        return '\'\'';
      }

      // replace references in string
      const ref = new RegExp('\\{([^\\}]*)\\}', 'msg');
      while ((match = ref.exec(param)) !== null) {
        // left part
        ret.push(`'${param.substring(index, match.index)}'`);
        index = match.index + match[0].length;
        ret.push(this._getValue(match[1], 'u.d'));
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
  _getValue(tag, utilFn='u.v') {
    
    if (!isNaN(tag)) {
      return tag;
    }
    
    // . notation
    if (tag === '.') {
      return 'l._it';
    } else if (tag[0] === '.') {
      tag = '_it' + tag;
    }

    const elements = [];
    let i, c, sub = false, idx = 0;
    // parse ref
    for (i = 0; i < tag.length; i = 1 + i) {
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

    // use utilFn (u.v by default) to invoke function on last element
    if (ret.length === 1) {
      return `${utilFn}(${ret[0]},null,l)`;
    }
    const _this = ret.slice(0,-1);
    return `${utilFn}(${ret.join('&&')},${_this.join('&&')},l)`;

  }

  _getParams(params) {
    let ret = '{';
    for (let key in params) {
      ret += `${key}:${this._getParam(params[key])},`;
    }
    ret += '}';
    return ret;
  }

  _getReference(block) {
    let ret = this._getValue(block.tag, 'u.d');
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
