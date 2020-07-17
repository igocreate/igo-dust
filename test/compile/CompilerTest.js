
const assert  = require('assert');

const Parser    = require('../../src/parse/Parser');
const Compiler  = require('../../src/compile/Compiler');
const Utils     = require('../../src/render/Utils');

describe('Compiler', () => {

  it('should compiler simple text', () => {
    const buffer  = [ 'Hello World' ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({}, Utils);
    assert.equal(r, buffer[0]);
  });

  it('should compile multiples lines', () => {
    const buffer  = [ 'Hello ', 'World' ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({}, Utils);
    assert.equal(r, buffer.join(''));
  });

  it('should replace reference', () => {
    const buffer  = [ 'Hello ', {type: 'r', tag: 'name'} ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({ name: 'World'}, Utils);
    assert.equal(r, 'Hello World');
  });

  it('should replace missing reference', () => {
    const buffer  = [ 'Hello ', {type: 'r', tag: 'name'} ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({}, Utils);
    assert.equal(r, 'Hello ');
  });

  it('should replace attributes', () => {
    const buffer  = [ 'Hello ', {type: 'r', tag: 'user.name'} ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({user: { name: 'John'}}, Utils);
    assert.equal(r, 'Hello John');
  });

  it('should replace missing attributes', () => {
    const buffer  = [ 'Hello ', {type: 'r', tag: 'user.email'} ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({}, Utils);
    assert.equal(r, 'Hello ');
  });

  it('should escape xml characters in references', () => {
    const buffer  = [ 'Hello ', {type: 'r', tag: 'name', f: ['h']} ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({name: '<World>'}, Utils);
    assert.equal(r, 'Hello &lt;World&gt;');
  });

  it('should *not* escape xml characters in raw references', () => {
    const buffer  = [ 'Hello ', {type: 'r', tag: 'name', f: []} ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({name: '<World>'}, Utils);
    assert.equal(r, 'Hello <World>');
  });

  it('should apply filters', () => {
    const buffer  = [ 'Hello ', {type: 'r', tag: 'name', f: ['uppercase', 'h']} ];
    const fn      = new Compiler().compile(buffer);
    const r       = fn({name: '<World>'}, Utils);
    assert.equal(r, 'Hello &lt;WORLD&gt;');
  });

});
