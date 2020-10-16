(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.IgoDust = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){

const Parser    = require('./src/parse/Parser');
const Compiler  = require('./src/compile/Compiler');
const Renderer  = require('./src/render/Renderer');
const Helpers   = require('./src/render/Helpers');
const Utils     = require('./src/render/Utils');

const Cache     = require('./src/Cache');
const config    = require('./src/Config');

//
module.exports.compile = (src) => {
  const buffer  = new Parser().parse(src);
  return new Compiler().compile(buffer);
};

//
module.exports.render = (compiled, data) => {
  return new Renderer().render(compiled, data);
};

//
module.exports.configure = (app) => {
  config.init(app.settings);
}

// expressjs engine
module.exports.engine = (filePath, options, callback) => {
  const compiled = Cache.getCompiled(filePath);
  const rendered = module.exports.render(compiled, options);
  callback(null, rendered);
};

//
module.exports.helpers  = Helpers;
module.exports.filters  = Utils.f;
module.exports.config   = config;

},{"./src/Cache":5,"./src/Config":6,"./src/compile/Compiler":7,"./src/parse/Parser":10,"./src/render/Helpers":12,"./src/render/Renderer":13,"./src/render/Utils":14}],5:[function(require,module,exports){

const FileUtils = require('./fs/FileUtils');
const Parser    = require('./parse/Parser');
const Compiler  = require('./compile/Compiler');

const config    = require('./Config');

//
class Cache {

  constructor() {
    this._CACHE = {};
  }

  get(key) {
    return this._CACHE[key];
  }

  put(key, value) {
    this._CACHE[key] = value;
  }

  getCompiled(filePath) {

    filePath = FileUtils.getFilePath(filePath);

    let compiled = this.get(filePath);
    if (config.cache && compiled) {
      // console.log('igo-dust cache hit: ' + filePath);
      return compiled;
    }

    // load, parse & compile
    const src       = FileUtils.loadFile(filePath);
    const buffer    = new Parser().parse(src);
    compiled        = new Compiler().compile(buffer);
    
    this.put(filePath, compiled);
    return compiled;
  }

};

module.exports = new Cache();
},{"./Config":6,"./compile/Compiler":7,"./fs/FileUtils":8,"./parse/Parser":10}],6:[function(require,module,exports){


class Config {

  constructor() {
    this.cache      = false;
    this.views      = './views';
    this.htmlencode = true;
    this.htmltrim   = true;
  }

  init(settings) {
    this._settings  = settings;
    this.cache      = settings['view cache'];
    this.views      = settings.views || this.views;
  }

};

module.exports = new Config();
},{}],7:[function(require,module,exports){


const ParseUtils  = require('../parse/ParseUtils');

class Compiler {

  constructor(options) {
    this.i  =   0;
    this.r  = `var r='',l=l||{},c=c||{ctx:[]};`;
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
        this.r += `if(c._${block.tag}){r+=c._${block.tag}();}`;
        if (block.buffer) {
          this.r += `else{`;
          this.compileBuffer(block.buffer);
          this.r += `}`;
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
        this.i++;
        const { i } = this;
        this._pushContext(block.params, true);
        this.r += `var a${i}=u.a(${this._getValue(block.tag)});`
        this.r += `if(a${i}){`;
        if (!block.buffer) {
          this.r += `r+=a${i};`
        } else {
          const it = block.params.it && ParseUtils.stripDoubleQuotes(block.params.it) || '_it';
          this.r += `l.$length=a${i}.length;`; // current array length
          this.r += `for(var i${i}=0;i${i}<a${i}.length;i${i}++){`;
          this.r += `l.${it}=a${i}[i${i}];`;
          this.r += `l.$idx=i${i};`; // current id
          this.compileBuffer(block.buffer, true);
          this.r += '}';
        }
        this.r += `}`;
        this._else(block);
        this._popContext(block.params, true);
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
        this._pushContext(block.params);
        const file = this._getParam(block.file);
        this.r += `r+=u.i(${file})(l,u,c);`;
        this._popContext(block.params);
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
      this.r += `ctx${i}.it=l._it;`;
      this.r += `ctx${i}.idx=l.$idx;`;
      this.r += `ctx${i}.length=l.$length;`;
    }

    this.r += `c.ctx.push(ctx${i});`;
  }

  _popContext(params, isArray) {
    const { i } = this;
    this.r += `var p_ctx${i}=c.ctx.pop();`
    Object.keys(params).forEach(key => {
      if (key === '$') {
        return;
      }
      this.r += `l.${key}=p_ctx${i}.${key};`;
    });
    if (isArray) {
      this.r += `l._it=p_ctx${i}.it;`;
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
        ret.push(this._getValue(match[1]));
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
      return 'l._it';
    }

    if (!isNaN(tag)) {
      return tag;
    }

    if (tag[0] === '.') {
      tag = '_it' + tag;
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
    const _this = ret.slice(0,-1);
    return `u.v(${ret.join('&&')},${_this.join('&&')},l)`;

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
    let ret = this._getValue(block.tag);
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

},{"../parse/ParseUtils":9}],8:[function(require,module,exports){

const fs      = require('fs');
const path    = require('path');

const config  = require('../Config');


// get absolute path
module.exports.getFilePath = (filePath) => {
  if (!path.isAbsolute(filePath) && filePath[0] !== '.') {
    // prefix views folder
    filePath = `${config.views}/${filePath}`;
  }
  return path.resolve(filePath);
}

//
module.exports.loadFile = (filePath) => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}
},{"../Config":6,"fs":1,"path":2}],9:[function(require,module,exports){


// remove spaces and double quotes
module.exports.cleanStr = (s) => {
  const regexp = /["]*(.[^"]*)/;
  const match  = regexp.exec(s);
  return match && match[1];
};

// remove spaces and double quotes
module.exports.stripDoubleQuotes = (s) => {
  const regexp = new RegExp('"', 'sg');
  return s.replace(regexp, '');
};

// 
module.exports.parseTag = (s) => {
  const i = s.indexOf(' ');
  if (i >= 0) {
    s = s.substring(0, i);
  }
  return s.substring(1);
};

//
module.exports.parseParams = (s) => {
  const params = {};
  
  let match;
  
  // string param
  const stringParam = new RegExp('(\\w+)=("[^="]*")', 'msg');
  while ((match = stringParam.exec(s)) !== null) {
    params[match[1]] = match[2];
  }

  // ref param
  const refParam = new RegExp('(\\w+)=([^" ]+)', 'msg');
  while ((match = refParam.exec(s)) !== null) {
    params[match[1]] = match[2];
  }

  // unnamed string param
  const unnamedStringParam = new RegExp('[^=] ("[^="]*")', 'msg');
  if ((match = unnamedStringParam.exec(s)) !== null) {
    params.$ = match[1];
  }
  return params;
};
},{}],10:[function(require,module,exports){

const ParseUtils  = require('./ParseUtils');
const Tags        = require('./Tags');

const config      = require('../Config');


class Parser {

  constructor() {
    this.global     = [];           // global buffer, to be returned by parse function
    this.buffer     = this.global;  // current buffer, where content is added
    this.stack      = [];           // stack of parents blocks
    this.contents   = {};           // contents to be replaced in layouts
  }

  // add string
  pushString(str) {
    // escape backslashes and single quotes
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/'/g, '\\\'');
    
    const i     = this.buffer.length - 1
    const last  = this.buffer[i];

    // concat with previous string buffer
    if (typeof last === 'string') {
      this.buffer[i] = last + str;
      return;
    }
    
    // push
    this.buffer.push(str);
  }

  // push block
  pushBlock(block) {
    this.buffer.push(block);
  }

  // stack the block, use its buffer as current
  stackBlock(block)  {
    block.buffer  = [];
    block.current = block.buffer;
    this.buffer   = block.buffer;
    this.stack.push(block);
  }

  getLastBlock() {
    return this.stack[this.stack.length-1];
  }

  pop() {
    const block = this.stack.pop();
    const last  = this.getLastBlock();
    this.buffer = last && last.current || this.global;
    return block;
  }

  addBody(tag) {
    const last = this.getLastBlock();
    if (!last) {
      throw new Error('Cannot add body outside of a block');
    }
    last.bodies       = last.bodies || {};
    last.bodies[tag]  = [];
    last.current      = last.bodies[tag];
    this.buffer       = last.bodies[tag];
  }

  parse(str) {
    // remove spaces at the beginning of lines and line breaks
    if (config.htmltrim) {
      str = str.replace(/^\s+/gm, '').replace(/[\r\n]/g , '');
    } else {
      str = str.replace(/\r/g , '\\r').replace(/\n/g , '\\n');
    }

    // remove comments
    str = str.replace(/{!.*?!}/gm, '');
    
    const openRegexp   = new RegExp('(.*?)\\{', 'msg');
    const closeRegexp  = new RegExp('(.*?)\\}', 'msg');

    let index = 0;

    // find opening '{'
    let openMatch, closeMatch;
    while ((openMatch = openRegexp.exec(str)) !== null) {
      if (openMatch[1]) {
        // preceding string
        this.pushString(openMatch[1]);
      }
      index = openMatch.index + openMatch[0].length;

      // find closing '}'
      let tag = '';
      closeRegexp.lastIndex = index;
      while ((closeMatch = closeRegexp.exec(str)) !== null) {
        tag += closeMatch[1];
        // skip when closing an internal '{'
        if (closeMatch[1].lastIndexOf('{') === -1) {
          break;
        }
        tag += '}';
      }

      if (!closeMatch) {
        // parsing error
        throw new Error(`Missing closing "}" at index ${index}`);
      }

      index = closeMatch.index + closeMatch[0].length;
      openRegexp.lastIndex = index;

      if (!this.parseTag(tag)) {
        // tag is ignored: push content to buffer
        this.pushString(`{${tag}}`);
      }
    }

    if (index < str.length) {
      this.pushString(str.slice(index))
    }

    // console.log('--- done ---');
    // console.dir(this);
    return this.global;
  }

  // parse tag. returns true if tag was found
  parseTag(str) {

    const tag = Tags[str[0]];

    const block = {
      type: str[0],
      tag:  str,
    };

    if (!tag) {
      // skip this tag if it's not correct
      if (str.indexOf(' ') >= 0 || str.indexOf('(') >= 0 || str.indexOf(';') >= 0) {
        return false;
      }
      // reference
      block.type = 'r';
      this.parseFilters(str, block);
      this.pushBlock(block);
      return true;
    }
    
    // set self closing tag
    if (str.endsWith('/')) {
      block.selfClosedTag = true;
      str = str.substring(0, str.length - 1);
    }
    
    // remove first char
    block.tag = ParseUtils.parseTag(str);

    // parse params
    block.params = ParseUtils.parseParams(str);

    // invoke tag function
    tag(this, block);
    
    return true;
  }

  parseFilters(str, block) {
    // parse filters
    const filtersRegexp = new RegExp('([ ]*\\|[ ]*\\w+)+', 'g');
    const filtersMatch  = filtersRegexp.exec(str);
    if (filtersMatch) {
      block.tag = str.substring(0, filtersMatch.index);
      const f   = filtersMatch[0].replace(/ /g, '').substring(1).split('|');
      const s   = f.indexOf('s');
      if (s > -1) {
        f.splice(s, 1);
      } else if (config.htmlencode) {
        f.push('h');
      }
      block.f = f;
    } else if (config.htmlencode) {
      block.f = ['h'];
    }
  }

}

module.exports = Parser;

},{"../Config":6,"./ParseUtils":9,"./Tags":11}],11:[function(require,module,exports){

const ParseUtils = require('./ParseUtils');


const _if = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block)
};

const _loop = (parser, block) => {
  parser.pushBlock(block);
  if (!block.selfClosedTag) {
    parser.stackBlock(block)
  }
};

const _not = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block)
};

const _helper = (parser, block) => {
  parser.pushBlock(block);
  if (!block.selfClosedTag) {
    parser.stackBlock(block);
  }
};

const _body = (parser, block) => {
  parser.addBody(block.tag);
};

const _end = (parser, block) => {
  const opening = parser.pop();
  if (opening && opening.type !== '>' && opening.tag !== block.tag)  {
    console.error(`Open/close tag mismatch! '${opening.tag}' <> '${block.tag}'`);
  }
};

const _content = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block);
};

const _include = (parser, block) => {
  block.file = block.params.$;
  parser.pushBlock(block);
};

const _insert = (parser, block) => {
  parser.pushBlock(block);
  if (!block.selfClosedTag) {
    parser.stackBlock(block);
  }
};



const TAGS = {
  '?': _if,
  '#': _loop,
  '^': _not,
  '@': _helper,
  ':': _body,
  '/': _end,
  '>': _include,
  '<': _content,
  '+': _insert,
};


module.exports = TAGS;

},{"./ParseUtils":9}],12:[function(require,module,exports){

//
const truthTest = (tag, test) => {
  return (params, locals) => test(params.key, params.value);
};

//
module.exports = {
  eq:   truthTest('eq',   (left, right) => left === right ),
  ne:   truthTest('ne',   (left, right) => left !== right ),
  lt:   truthTest('lt',   (left, right) => Number(left) <   Number(right)),
  lte:  truthTest('lte',  (left, right) => Number(left) <=  Number(right)),
  gt:   truthTest('gt',   (left, right) => Number(left) >   Number(right)),
  gte:  truthTest('gte',  (left, right) => Number(left) >=  Number(right)),

  first:  (params, locals) => locals.$idx === 0,
  last:   (params, locals) => locals.$length && locals.$length - 1 === locals.$idx,
  sep:    (params, locals) => locals.$length && locals.$length - 1 !== locals.$idx,
  
  select: () => console.log('Error : @select not supported !'),
};


},{}],13:[function(require,module,exports){

const Utils     = require('./Utils');
const Helpers   = require('./Helpers');

const Parser    = require('../parse/Parser');
const Compiler  = require('../compile/Compiler');

class Renderer {

  render(str, data) {
    Utils.h.helpers = Helpers;
    if (typeof str === 'function') {
      return str(data, Utils);
    }
    const buffer  = new Parser().parse(str);
    const fn      = new Compiler().compile(buffer);

    return fn(data, Utils);
  }
}

module.exports = Renderer;

},{"../compile/Compiler":7,"../parse/Parser":10,"./Helpers":12,"./Utils":14}],14:[function(require,module,exports){

const Cache = require('../Cache');

// special chars
const HCHARS  = /[&<>"']/,
      AMP     = /&/g,
      LT      = /</g,
      GT      = />/g,
      QUOT    = /\"/g,
      SQUOT   = /\'/g;

const BS      = /\\/g,
      FS      = /\//g,
      CR      = /\r/g,
      LS      = /\u2028/g,
      PS      = /\u2029/g,
      NL      = /\n/g,
      LF      = /\f/g,
      SQ      = /'/g,
      DQ      = /"/g,
      TB      = /\t/g;


const htmlencode = (s)=> {
  if (!s || !s.replace || !HCHARS.test(s)) {
    return s;
  }
  return s
      .replace(AMP,'&amp;')
      .replace(LT,'&lt;')
      .replace(GT,'&gt;')
      .replace(QUOT,'&quot;')
      .replace(SQUOT, '&#39;');
};

const escapeJs = (s) => {
  if (typeof s === 'string') {
    return s
      .replace(BS, '\\\\')
      .replace(FS, '\\/')
      .replace(DQ, '\\"')
      .replace(SQ, '\\\'')
      .replace(CR, '\\r')
      .replace(LS, '\\u2028')
      .replace(PS, '\\u2029')
      .replace(NL, '\\n')
      .replace(LF, '\\f')
      .replace(TB, '\\t');
  }
  return s;
};

const stringifyJson = (o) => {
  return o && JSON.stringify(o)
          .replace(LS, '\\u2028')
          .replace(PS, '\\u2029')
          .replace(LT, '\\u003c');
};

// Filters
const f = {
  h:          htmlencode,
  j:          escapeJs,
  u:          encodeURI,
  uc:         encodeURIComponent,
  js:         stringifyJson,
  jp:         JSON.parse,
  uppercase:  s => s.toUpperCase(),
  lowercase:  s => s.toLowerCase(),
};


// return value to be displayed (if it's a function, invoke it with locals)
const v = (s, t, l) => {
  if (typeof s === 'function') {
    return s.call(t, l);
  }
  if (s === 0) {
    return s;
  }
  return s || '';
};

// return boolean
const b = (v) => {
  if (!v) {
    return false;
  }
  if (v.length === 0) {
    return false;
  }
  return true;
};

// return array
const a = (v) => {
  if (Array.isArray(v)) {
    return v;
  }
  if (v) {
    return [v];
  }
  return null;
};

// helpers
const h = (t, p, l) => {
  if (!h.helpers || !h.helpers[t]) {
    return null;
  }
  return h.helpers[t](p, l);
};

// include file
const i = (file) => {
  if (!file.endsWith('.dust')) {
    file = file + '.dust';
  }
  return Cache.getCompiled(file);
};

module.exports = { a, b, v, h, f, i };

},{"../Cache":5}]},{},[4])(4)
});
