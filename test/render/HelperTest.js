
/* global describe, it */


const assert        = require('assert');
const Renderer      = require('../../src/render/Renderer');
const Helpers       = require('../../src/render/Helpers');

const HELPERS = {

  nl2br: function(params) {
    if (params.value) {
      return params.value.replace(/(\r\n|\n\r|\r|\n)/g, '<br/>');
    }
  },

  boolean: function(params) {
    const color = params.value ? 'success' : 'danger';
    return `<div class="bullet bullet-sm bullet-${color}"></div>`;
  },

  isNull: (params) => {
    return params.value === null;
  }
};


describe('Render Helpers', () => {

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

  it('should allow quotes in params', () => {
    const template  = 'Hello {@eq key=w value="world\'s one"}{w}{/eq}';
    const r         = new Renderer().render(template, { w: 'World\'s one' });
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
    let r           = new Renderer().render(template, { w: 3 });
    assert.equal(r, 'Hello World');
    r               = new Renderer().render(template, { w: 1 });
    assert.equal(r, 'Hello ');
  });

  it('should render with number value', () => {
    const template  = 'Hello {@gt key=w value=2}World{/gt}';
    let r           = new Renderer().render(template, { w: 3 });
    assert.equal(r, 'Hello World');
    r               = new Renderer().render(template, { w: 1 });
    assert.equal(r, 'Hello ');
  });

  it('should render else', () => {
    const template  = 'Hello {@eq key=w value="world"}{w}{:else}world !{/eq}';
    const r         = new Renderer().render(template, { w: 'World' });
    assert.equal(r, 'Hello world !');
  });

  it.skip('should render select with eq', () => {
    const template  = 'Hello {@select key=w}{@eq value="puppies"}Puppies{/eq}{@eq value="bunnies"}test-bunnies{/eq}{/select}';
    const r         = new Renderer().render(template, { w: 'puppies' });
    assert.equal(r, 'Hello Puppies');
  });

  it('should render custom helper', () => {
    
    Helpers.nl2br   = HELPERS.nl2br;
    Helpers.boolean = HELPERS.boolean;

    // boolean false
    let template = 'Hello ? {@boolean value=b /}';
    let r = new Renderer(HELPERS).render(template, {b: false});
    assert.equal(r, 'Hello ? <div class="bullet bullet-sm bullet-danger"></div>');
    // boolean true
    r = new Renderer(HELPERS).render(template, {b: true});
    assert.equal(r, 'Hello ? <div class="bullet bullet-sm bullet-success"></div>');
    // nl2br
    template = '{@nl2br value=text /}';
    r = new Renderer(HELPERS).render(template, {text: 'Hello\nWorld'});
    assert.equal(r, 'Hello<br/>World');
  });

  Helpers.t = (params, locals) => { // eslint-disable-line
    return params.key;
  };

  it('should render custom helper with string param', () => {
    const template  = 'Hello {@t key="World" /} !';
    const r         = new Renderer().render(template);
    assert.equal(r, 'Hello World !');
  });

  it('should render custom helper with empty string param', () => {
    const template  = 'Hello {@t key="" /} !';
    const r         = new Renderer().render(template);
    assert.equal(r, 'Hello  !');
  });

  it('should render custom helper with ref param', () => {
    const template  = 'Hello {@t key=txt.w /} !';
    const r         = new Renderer().render(template, { txt: { w: 'World' }});
    assert.equal(r, 'Hello World !');
  });
  
  it('should render custom helper with string + ref param', () => {
    const template  = 'Hello {#obj}{@t key="txt.{.attr}" /}{/obj} !';
    const r         = new Renderer().render(template, { obj: {attr: 'w' } , txt: { w: 'World' }});
    assert.equal(r, 'Hello txt.w !');
  });

  it('should render custom helper with string + missingref param', () => {
    const template  = 'Hello {#obj}{@t key="txt.{.attr}" /}{/obj} !';
    const r         = new Renderer().render(template, { obj: 1 });
    assert.equal(r, 'Hello txt. !');
  });

  it('should send null param and not emptystring', () => {
    Helpers.isNull  = HELPERS.isNull;
    const template  = 'Hello {@isNull value=obj /} !';
    const r         = new Renderer().render(template, { obj: null});
    assert.equal(r, 'Hello true !');
  });

  it('should throw error if helper does not exist', () => {
    const template  = 'Hello {@foo value=obj /} !';
    try {
      new Renderer().render(template);
      assert.fail();
    } catch(err) {
      assert.equal(err.message, 'Error: helper @foo not found!');
    }
  });

});
