
/* global describe, it */


const assert    = require('assert');

const Renderer  = require('../../src/render/Renderer');

describe('Render Includes & Layouts', () => {

  it('should render include with param', () => {
    const template  = 'Hello {> "./test/templates/_world_ref" world="World" /}';
    const r         = new Renderer().render(template);
    assert.equal(r, 'Hello World!');
  });

  it('should render include with reference param', () => {
    const template  = 'Hello {> "./test/templates/_world_ref" world=w /}';
    const r         = new Renderer().render(template, {w: 'World'});
    assert.equal(r, 'Hello World!');
  });

  it('should render include with nested reference param', () => {
    const template  = 'Hello {> "./test/templates/_world_ref" world=test.w /}';
    const r         = new Renderer().render(template, {test: {w: 'World'}});
    assert.equal(r, 'Hello World!');
  });

  it('should render layout with content', () => {
    const template  = '{> "./test/templates/layout" /} {<content}{test.w}{/content}';
    const r         = new Renderer().render(template, {test: {w: 'World'}});
    assert.equal(r, 'Hello World! ');
  });

  it('should not crash if no content', () => {
    const template  = '{> "./test/templates/layout" /}';
    const r         = new Renderer().render(template, {test: {w: 'World'}});
    assert.equal(r, 'Hello !');
  });

  it('should render dynamic include', () => {
    const template  = 'Hello {> "./test/templates/{file}" /}';
    const r         = new Renderer().render(template, {file: '_world_ref', world: 'World'});
    assert.equal(r, 'Hello World!');
  });

  it('should render layout with content and loop', () => {
    const template  = '{> "./test/templates/layout" /} {<content}{#company}{.name}{/company}{/content}';
    const r         = new Renderer().render(template, {company: { name: 'World' }});
    assert.equal(r, 'Hello World! ');
  });

  it('should render layout with default content', () => {
    const template  = '{> "./test/templates/layout_title" /} {<content}World{/content}';
    const r         = new Renderer().render(template, {company: { name: 'World' }});
    assert.equal(r, 'Hello World! ');
  });

  it('should render layout with default content', () => {
    const template  = '{> "./test/templates/layout_title" /} {<title}Hi{/title} {<content}World{/content}';
    const r         = new Renderer().render(template, {company: { name: 'World' }});
    assert.equal(r, 'Hi World!  ');
  });


  it('should render recursive include', () => {
    const template  = '{#user}{> "./test/templates/_recursive" friends_list=.friends/}{.name}{/user}';
    const r         = new Renderer().render(template, {
      user: {
        friends: [{
          name: 'John',
          friends: [{
            name: 'Jane',
            friends: []
          }]
        }],
        name: 'Bernard'
      }
    });
    assert.equal(r, 'John, Jane, Bernard');
  });

  it('should replace missing insert tags', () => {
    const template = '<meta name="description" content="{+description/}"></meta>';
    const r         = new Renderer().render(template);
    assert.equal(r, '<meta name="description" content=""></meta>');
  });

});
