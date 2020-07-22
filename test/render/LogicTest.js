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

  it('should render ^ condition on attribute', () => {
    const template  = 'Hello {^test.a}World{/test.a} OK.';
    const r         = new Renderer().render(template, { test: { a: true } });
    assert.equal(r, 'Hello  OK.');
    const s         = new Renderer().render(template, { test: false });
    assert.equal(s, 'Hello World OK.');
    const t         = new Renderer().render(template, {});
    assert.equal(t, 'Hello World OK.');
  });

  it('should render ^ condition with else', () => {
    const template  = 'Hello {^test.a}World{:else}Planet{/test.a}.';
    const r         = new Renderer().render(template, { test: { a: true } });
    assert.equal(r, 'Hello Planet.');
    const s         = new Renderer().render(template, { test: { a: [] } });
    assert.equal(s, 'Hello World.');
    const t         = new Renderer().render(template, {});
    assert.equal(t, 'Hello World.');
  });

  it('should execute condition function', () => {
    const template  = 'Hello{?test world=w} World{/test}.';
    const r         = new Renderer().render(template, { w: true, test: (l) => l.world});
    assert.equal(r, 'Hello World.');
    const s         = new Renderer().render(template, { w: false, test: (l) => l.world});
    assert.equal(s, 'Hello.');
  });

  it('should consider an empty array as a false condition', () => {
    const template  = 'OK {?users}{users.length} users{/users}.';
    const r         = new Renderer().render(template, { users: [] });
    assert.equal(r, 'OK .');
  });

});
