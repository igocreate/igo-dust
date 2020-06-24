const assert    = require('assert');

const Renderer  = require('../../src/render/Renderer');

const COL1 = [ 1, 2, 3 ];
const COL2 = [ 'a', 'b' ];

describe('Render Basic', () => {

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

});
