const assert    = require('assert');

const Renderer  = require('../../src/render/Renderer');

describe('Render Logic', () => {

  it('should render simple condition', () => {
    const template  = 'Hello {?test}World{/test} OK.';
    const r         = new Renderer().render(template, { test: true });
    assert.equal(r, 'Hello World OK.');
    const s         = new Renderer().render(template, { test: false });
    assert.equal(s, 'Hello  OK.');
  });

  it('should render condition on attribute', () => {
    const template  = 'Hello {?test.a}World{/test.a} OK.';
    const r         = new Renderer().render(template, { test: { a: true } });
    assert.equal(r, 'Hello World OK.');
    const s         = new Renderer().render(template, { test: false });
    assert.equal(s, 'Hello  OK.');
    const t         = new Renderer().render(template, {});
    assert.equal(t, 'Hello  OK.');
  });

  it('should render nested condition', () => {
    const template  = '{?world}World{?ok} OK{/ok}{/world}';
    const r         = new Renderer().render(template, {});
    assert.equal(r, '');
    const s         = new Renderer().render(template, { world: true });
    assert.equal(s, 'World');
    const t         = new Renderer().render(template, { world: true, ok: true });
    assert.equal(t, 'World OK');
  });

  it('should render condition with else', () => {
    const template  = 'Hello {?test}World{:else}Good bye{/test} OK.';
    const r         = new Renderer().render(template, { test: true });
    assert.equal(r, 'Hello World OK.');
    const s         = new Renderer().render(template, { test: false });
    assert.equal(s, 'Hello Good bye OK.');
  });

});
