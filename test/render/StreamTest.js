'use strict';
/* global describe, it */

const assert    = require('assert');

const Config  = require('../../src/Config');
const Renderer  = require('../../src/render/Renderer');
const Helpers   = require('../../src/render/Helpers');

class Stream {
  constructor() {
    this.buffer = '';
  }
  
  write(x) {
    if (typeof x !== 'string') {
      throw new Error('chunk must be a string, found ' + typeof x);
    }
    this.buffer += x;
  }

}

//
describe('Stream response', () => {

  it('should stream simple response', () => {
    const template  = 'Hello World';
    const stream    = new Stream();
    new Renderer().render(template, {}, stream);
    assert.equal(stream.buffer, template);
  });  

  it('should stream response with include', () => {
    const template  = '{> "./test/templates/layout" /} {<content}{test.w}{/content}';
    const stream    = new Stream();
    new Renderer().render(template, {test: {w: 'World'}}, stream);
    assert.equal(stream.buffer, 'Hello World! ');
  });

  it('should execute function if tag is a function', () => {
    const template  = 'Hello {#t key="World" /}';
    const stream    = new Stream();
    const r         = new Renderer().render(template, { t: (params) => params.key }, stream);
    assert.equal(stream.buffer, 'Hello World');
  });


});
