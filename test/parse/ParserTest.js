
const assert  = require('assert');

const Parser  = require('../../src/parse/Parser');
const { Console } = require('console');

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
    assert.equal(buffer[1].tag, 'world');
    assert.equal(buffer[1].f, 'e');
    assert.equal(buffer[2], ', ok. ');
    assert.equal(buffer[3].tag, 'world');
    assert.equal(buffer[4].tag, 'world');
  });

  it('should handle tag error', () => {
    const TEMPLATE = 'Hello {world ok.';
    try {
      const buffer = new Parser().parse(TEMPLATE);
    } catch(err) {
      assert.equal(err.message, 'Missing closing }. index: 7');
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
    assert.equal(buffer[1].f, 'reverse|uppercase|urlencode|e');
  });

  it('should parse nested tags', () => {
    const TEMPLATE = '{?tag}Hello {?tag}World{/tag}{/tag}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 2);
    const nested = buffer[0];
    assert.equal(nested.type, '?');
    assert.equal(nested.buffer.length, 2);
    assert.equal(nested.buffer[0], 'Hello ');
    assert.equal(nested.buffer[1].type, '?');
  });

  it('should parse loop tags', () => {
    const TEMPLATE = 'Hello {#worlds}{.name}{/worlds}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[1].type, '#');
    assert.equal(buffer[1].buffer.length, 1);
  });

  it('should parse nested loop tags', () => {
    const TEMPLATE = 'Hello {#COL1}a{#COL2}b{/COL2} {/COL1}';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 2);
    assert.equal(buffer[1].type, '#');
    assert.equal(buffer[1].buffer.length, 3);
    assert.equal(buffer[1].buffer[1].type, '#');
  });

  it('should parse multiple lines', () => {
    const TEMPLATE = 'Hello \r\n oo {#COL1}a{/COL1} World';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[1].type, '#');
    assert.equal(buffer[1].buffer.length, 1);
  });


  it('should parse else tags', () => {
    const TEMPLATE = '{?tag}Hello{:else}World{/tag}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 2);
    const nested = buffer[0];
    assert(nested.bodies.else);
    assert.equal(nested.buffer[0], 'Hello');
    assert.equal(nested.bodies.else[0], 'World');
  });

  it('should parse nested tags in else tag', () => {
    const TEMPLATE = '{?tag}Hello{:else}World {name}{/tag}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 2);
    const nested = buffer[0];
    assert(nested.bodies.else);
    assert.equal(nested.buffer[0], 'Hello');
    assert.equal(nested.bodies.else[0], 'World ');
    assert.equal(nested.bodies.else[1].type, 'r');
    assert.equal(nested.bodies.else[1].tag, 'name');
  });

  it('should parse many bodies tags', () => {
    const TEMPLATE = '{?tag}Hello{:else}World{:other}Good Bye{/tag}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 2);
    const nested = buffer[0];
    assert(nested.bodies.else);
    assert.equal(nested.buffer[0], 'Hello');
    assert.equal(nested.bodies.else[0], 'World');
    assert.equal(nested.bodies.other[0], 'Good Bye');
  });

  it('should parse ^ tags', () => {
    const TEMPLATE = 'Hello {^tag}World{/tag}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[0], 'Hello ');
    assert.equal(buffer[1].type, '^');
    assert.equal(buffer[1].buffer.length, 1);
    assert.equal(buffer[2], ', ok.');
  });

  it('should parse @eq tag with params', () => {
    const TEMPLATE = 'Hello {@eq key="key" value=value}World{/eq}, ok.';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[0], 'Hello ');
    assert.equal(buffer[1].type, '@');
    assert.equal(buffer[1].tag, 'eq');
    assert.equal(buffer[1].params.key.value, 'key');
    assert.equal(buffer[1].params.key.type, 's');
    assert.equal(buffer[1].params.value.value, 'value');
    assert.equal(buffer[1].params.value.type, 'r');
    assert.equal(buffer[1].buffer.length, 1);
  });

  it('should parse include tag', () => {
    const TEMPLATE = ' Hello {> "./templates/_world" } !';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    assert.equal(buffer[1], 'World');
  });

  it('should parse include tag with params', () => {
    const TEMPLATE = ' Hello {> "./templates/_world_ref" string="str" reference=ref} ...';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 4);
    assert.equal(buffer[1].tag, 'world');
    assert.equal(buffer[1].params.string.value, 'str');
    assert.equal(buffer[1].params.reference.value, 'ref');
    assert.equal(buffer[1].params.reference.type, 'r');
  });

  it('should not loose params from block inside include', () => {
    const TEMPLATE = ' Hello {> "./templates/_array" w=world}';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 2);
    const nested = buffer[1].buffer;
    assert.equal(nested[0].params.w.value, 'world');
    assert.equal(nested[2].params.w.value, 'world');
    assert.equal(nested[2].params.w.type, 'r');
  });


  it('should parse layout tag', () => {
    const TEMPLATE = ' {> "./templates/layout" } {<content}World{/content} ';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 6);
    const content = buffer[2];
    assert.equal(content.tag, 'content');
    assert.equal(content.buffer.length, 1);
    assert.equal(content.buffer[0], 'World');
  });

  it('should helper tag without out', () => {
    const TEMPLATE = 'Hello {@date date=date format="DD/MM/YYYY" /}{?tag}!{/tag}';
    const buffer = new Parser().parse(TEMPLATE);
    assert.equal(buffer.length, 3);
    let nested = buffer[1];
    assert.equal(nested.selfClosedTag, true);
    assert.equal(nested.params.date.value, 'date');
    assert.equal(nested.params.format.value, 'DD/MM/YYYY');
    nested = buffer[2];
    assert.equal(nested.buffer[0], '!');
  });
});
