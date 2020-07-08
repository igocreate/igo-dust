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

  it('should render nested loops with .', () => {
    const template  = 'Hello {#COL1}{.}{#COL2}{.}{/COL2} {/COL1}';
    const r         = new Renderer().render(template, { COL1, COL2 });
    assert.equal(r, 'Hello 1ab 2ab 3ab ');
  });

  it('should render if not an array', () => {
    const template  = 'Hello {#COL1}a{it}{/COL1}';
    const r         = new Renderer().render(template, { COL1: 1 });
    assert.equal(r, 'Hello a1');
  });

  it('should render nested loops on "it"', () => {
    const template  = 'Hello {#COL0}z{#it}x{it}{/it}{/COL0}';
    const r         = new Renderer().render(template, { COL0: [COL1, COL2] });
    assert.equal(r, 'Hello zx1x2x3zxaxb');
  });

  it('should render nested loops on "."', () => {
    const template  = 'Hello {#COL0}z{#.}x{.}{/.}{/COL0}';
    const r         = new Renderer().render(template, { COL0: [COL1, COL2] });
    assert.equal(r, 'Hello zx1x2x3zxaxb');
  });

  it('should render loops with check on "."', () => {
    const template  = 'Hello {#COL0}{?.a}{it.b}{/.a}{/COL0}';
    const r         = new Renderer().render(template, { COL0: [{a: false, b: "False"}, {a: true, b: 'True'}] });
    assert.equal(r, 'Hello True');
  });

  it('should render loop with @first', () => {
    const template  = 'Hello {#COL1}A{@first}{it}{/first}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello A1AA');
  });

  it('should render loop with @last', () => {
    const template  = 'Hello {#COL1}A{@last}{it}{/last}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello AAA3');
  });

  it('should render loop with @sep', () => {
    const template  = 'Hello {#COL1}A{@sep}{it},{/sep}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello A1,A2,A');
  });

  it('should render loop with params', () => {
    const template  = 'Hello {#COL1 w="World"}World{@sep}{it},{/sep}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello World1,World2,World');
  });

  it('should render loops inside includes', () => {
    const template  = 'Hello {> "./templates/_array" world=w}.';
    const r         = new Renderer().render(template, { w: 'World', array: COL1});
    assert.equal(r, 'Hello World 1, World 2, World 3.');
  });

  it('should render complex loops', () => {
    const template  = '{#friends}#{.id} {.name}: {#.friends}{.name}{@sep}, {/sep}{/.friends}{@sep}<br/>{/sep}{/friends}';
    const r         = new Renderer().render(template, { friends: [{
        id:   1,
        name: "Gardner Alvarez",
        friends: [{"name": "Gates Lewis"},{"name": "Britt Stokes"}]
      },{
        id:   2,
        name: "Gates Lewis",
        friends: [{"name": "Gardner Alvarez"}]
      }
    ]});
    assert.equal(r, '#1 Gardner Alvarez: Gates Lewis, Britt Stokes<br/>#2 Gates Lewis: Gardner Alvarez');
  });

  it('should pass it at param', () => {
    const template  = 'Hello {#COL2}A{> "./templates/_world_ref" world=it}{@sep} {/sep}{/COL2}';
    const r         = new Renderer().render(template, { COL2 });
    assert.equal(r, 'Hello Aa! Ab!');
  });

  it('should pass complex it', () => {
    const template  = 'Hello {#COL}A{> "./templates/_world_ref" world=it.a}{@sep} {/sep}{/COL}';
    const r         = new Renderer().render(template, {COL: [ {a: 1}, {a: 2}] });
    assert.equal(r, 'Hello A1! A2!');
  });

});
