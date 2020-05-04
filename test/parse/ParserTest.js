
const assert  = require('assert');

const Parser  = require('../../src/parse/Parser');

describe('Parser', () => {
  it('should parse simple text', () => {
    const TEMPLATE = 'Hello World';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 1);
    assert.equal(buffer[0], TEMPLATE);
  });

  it('should parse reference', () => {
    const TEMPLATE = 'Hello {world}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[0], 'Hello ');
    assert.equal(buffer[2], ', ok.');
  });

  it('should parse multiple references', () => {
    const TEMPLATE = 'Hello {world}, ok. {world}{world}';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 5);
    assert.equal(buffer[0], 'Hello ');
    assert.equal(buffer[1].type, 'r');
    assert.equal(buffer[1].str, 'world');
    assert.equal(buffer[1].f, undefined);
    assert.equal(buffer[2], ', ok. ');
  });

  it('should handle tag error', () => {
    const TEMPLATE = 'Hello {world ok.';
    try {
      const buffer = new Parser().parse(TEMPLATE);
    } catch(err) {
      assert.equal(err.message, 'Missing closing tag. index: 7');
    }
  });

  it('should parse opening and closing tags', () => {
    const TEMPLATE = 'Hello {?tag}World{/tag}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[0], 'Hello ');
    assert.equal(buffer[1].type, '?');
    assert.equal(buffer[1].buffer.length, 1);
    assert.equal(buffer[2], ', ok.');
  });

  it('should parse filters', () => {
    const TEMPLATE = 'Hello {name|reverse|uppercase | urlencode}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[1].tag, 'name');
    assert.equal(buffer[1].f, 'reverse|uppercase|urlencode');
  });

});
