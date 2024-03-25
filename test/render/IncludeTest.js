
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

  it('should render layout with default content and include with body', () => {
    const template  = '{> "./test/templates/layout_title" /} {<title}Hi{/title} {<content}World, {> "./test/templates/_body"}body{/>}{/content}';
    const r         = new Renderer().render(template, {company: { name: 'World' }});
    assert.equal(r, 'Hi World, Le body est inséré ici!  ');
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

  it('should render include with body', () => {
    const template  = '! {> "./test/templates/_body"}body{/>} !';
    const r         = new Renderer().render(template);
    assert.equal(r, '! Le body est inséré ici !');
  });

  it('should render include with body and dont keep the body after', () => {
    const template  = '! {> "./test/templates/_body"}body{/>} {> "./test/templates/_body" /} {> "./test/templates/_body"}BODY{/>} !';
    const r         = new Renderer().render(template);
    assert.equal(r, '! Le body est inséré ici Le  est inséré ici Le BODY est inséré ici !');
  });

  it('should render include with reference body', () => {
    const template  = '! {> "./test/templates/_body"}{b}{/>} !';
    const r         = new Renderer().render(template, {b: 'body'});
    assert.equal(r, '! Le body est inséré ici !');
  });

  it('should render include with body and ref', () => {
    const template  = '1 {> "./test/templates/_body2" quatre="4"}3{/>} 7';
    const r         = new Renderer().render(template, { n: 5,});
    assert.equal(r, '1 2 3 4 5 6 7');
  });

  it('should render several includes with body', () => {
    const template  = '1 {> "./test/templates/_body2" quatre="4"}3{/>} {> "./test/templates/_body2" quatre="17"}18{/>} 7';
    const r         = new Renderer().render(template, { n: 5,});
    assert.equal(r, '1 2 3 4 5 6 2 18 17 5 6 7');
  });

  it('should render includes with body with include', () => {
    const template  = 'Premier ({> "./test/templates/_body3"}include{/>}), Troisième ({> "./test/templates/_body2" quatre="4"}3{/>})';
    const r         = new Renderer().render(template, { n: 5,});
    assert.equal(r, 'Premier (Second include : "Le body est inséré ici"), Troisième (2 3 4 5 6)');
  });

  it('should render includes with nested bodies', () => {
    const template  = '! {> "./test/templates/_body"}OK {> "./test/templates/_body"}body{/>}{/>} !';
    const r         = new Renderer().render(template, { n: 5,});
    assert.equal(r, '! Le OK Le body est inséré ici est inséré ici !');
  });

});
