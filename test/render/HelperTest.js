const assert    = require('assert');

const Renderer  = require('../../src/render/Renderer');

describe('Render Helper', () => {

  it('should render with eq helper', () => {
    const template  = 'Hello {@eq key=w value="World"}{w}{/eq}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello World');
  });

  it('should render with false eq helper', () => {
    const template  = 'Hello {@eq key=w value="world"}{w}{/eq}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello ');
  });

  it('should render with ne helper', () => {
    const template  = 'Hello {@ne key=w value="world"}{w}{/ne}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello World');
  });

  it('should render with false ne helper', () => {
    const template  = 'Hello {@ne key=w value="World"}{w}{/ne}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello ');
  });

  it('should not crash with missing params', () => {
    const template  = 'Hello {@eq key=w}{w}{/eq}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello ');
  });

  it('should not crash with wrong ref params', () => {
    const template  = 'Hello {@eq key=e value="World"}{w}{/eq}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello ');
  });

  it('should render with gt helper', () => {
    const template  = 'Hello {@gt key=w value="2"}World{/gt}';
    const r         = new Renderer().render(template, { w: 3 });
    assert.equal(r, 'Hello World');
  });

  it('should render else', () => {
    const template  = 'Hello {@eq key=w value="world"}{w}{:else}world !{/eq}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello world !');
  });

  it('should render select with eq', () => {
    const template  = 'Hello {@select key=w}{@eq value="puppies"}Puppies{/eq}{@eq value="bunnies"}test-bunnies{/eq}{/select}';
    const r         = new Renderer().render(template, { w: 'puppies' });
    assert.equal(r, 'Hello Puppies');
  });
});
