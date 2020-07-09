const assert    = require('assert');

const Renderer  = require('../../src/render/Renderer');

describe('Render Basics', () => {

  it('should render simple text', () => {
    const template  = 'Hello World';
    const r         = new Renderer().render(template);
    assert.equal(r, template);
  });

  it('should replace simple text', () => {
    const template  = 'Hello {w}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello World');
  });

  it('should not crash when reference does not exist', () => {
    const template  = 'Hello {a.b.c}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello ');
  });

  it('should ignore comment', () => {
    const template  = 'Hello {! comment !}World';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello World');
  });

  it('should ignore tag inside comment', () => {
    const template  = 'Hello {! comment {test} !}World';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello World');
  });

  it('should excecute function if reference if a function', () => {
    const template  = 'Hello {w}';
    const r         = new Renderer().render(template, { w: () => 'World' });
    assert.equal(r, 'Hello World');
  });

});
