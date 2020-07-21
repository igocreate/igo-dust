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
    const r         = new Renderer().render(template);
    assert.equal(r, 'Hello ');
  });

  it('should ignore comment', () => {
    const template  = 'Hello {! comment !}World';
    const r         = new Renderer().render(template);
    assert.equal(r, 'Hello World');
  });

  it('should ignore tag inside comment', () => {
    const template  = 'Hello {! comment {test} !}World';
    const r         = new Renderer().render(template);
    assert.equal(r, 'Hello World');
  });

  it('should execute function if reference is a function', () => {
    const template  = 'Hello {w}';
    const r         = new Renderer().render(template, { w: () => 'World' });
    assert.equal(r, 'Hello World');
  });

  it('should access objects by key in references', () => {
    const template  = 'Hello {users[hello].lastname}';
    const r         = new Renderer().render(template, { users: { john : { lastname: 'World' }}, hello: 'john' });
    assert.equal(r, 'Hello World');
  });

  it('should access objects by complex key in references', () => {
    const template  = 'Hello {users[hello.one].lastname}';
    const r         = new Renderer().render(template, { users: { john : { lastname: 'World' }}, hello: { one: 'john' } });
    assert.equal(r, 'Hello World');
  });

  it('should access objects by complex key in references', () => {
    const template  = 'Hello {users[hello.one].lastname}';
    const r         = new Renderer().render(template, { users: { john : { lastname: 'World' }}, hello: { one: 'john' } });
    assert.equal(r, 'Hello World');
  });

  it('should access array elements by index in references', () => {
    const template  = 'Hello {users[1]}';
    const r         = new Renderer().render(template, { users: [ 'john', 'World' ]});
    assert.equal(r, 'Hello World');
  });

  it('should access array elements by index in references', () => {
    const template  = 'Hello {users[idx].lastname}';
    const r         = new Renderer().render(template, { users: [ {}, { lastname: 'World' } ], idx: 1});
    assert.equal(r, 'Hello World');
  });

});
