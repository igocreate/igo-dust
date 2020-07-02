const assert    = require('assert');

const Renderer  = require('../../src/render/Renderer');

const COL1 = [ 1, 2, 3 ];
const COL2 = [ 'a', 'b' ];

describe.only('Render Basic', () => {

  it('should render simple loop', () => {
    const template  = 'Hello {#COL1}a{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello aaa');
  });

  it('should render nested loops', () => {
    const template  = 'Hello {#COL1}{it}{#COL2}{it}{/COL2} {/COL1}';
    const r         = new Renderer().render(template, { COL1, COL2 });
    assert.equal(r, 'Hello 1ab 2ab 3ab ');
  });

  it('should render if not a array', () => {
    const template  = 'Hello {#COL1}a{it}{/COL1}';
    const r         = new Renderer().render(template, { COL1: 1 });
    assert.equal(r, 'Hello a1');
  });
  
  it.only('should render nested loops on "it"', () => {
    const template  = 'Hello {#COL0}z{#it}x{it}{/it}{/COL0}';
    const r         = new Renderer().render(template, { COL0: [COL1, COL2] });
    assert.equal(r, 'Hello zx1x2x3zxaxb');
  });

});
