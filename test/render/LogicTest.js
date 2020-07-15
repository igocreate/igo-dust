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

  it('should render condition if function', () => {
    const template  = 'Hello{?test world=w} World{/test}.';
    const r         = new Renderer().render(template, { w: true, test: (params) => params.world});
    assert.equal(r, 'Hello World.');
    const s         = new Renderer().render(template, { w: false, test: (params) => params.world});
    assert.equal(s, 'Hello.');
  });

  // ToDo
  it.skip('should considere an empty array as a false condition', () => {
    const template  = '<input type="checkbox" {?isChecked}checked{/isChecked} /> {?users} {users.length} users{/users} {^friends}, no friends{/friens}!';
    const r         = new Renderer().render(template, {
      "isChecked": false,
      "users": ["John", "Jane"],
      "friends": []
    });
    assert.equal(r, '<input type="checkbox" /> 2 users, no friends!');
  });

});
