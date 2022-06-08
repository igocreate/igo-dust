
/* global describe, it */

const assert    = require('assert');

const Renderer  = require('../../src/render/Renderer');

const COL1 = [ 1, 2, 3 ];
const COL2 = [ 'a', 'b' ];
const FRIENDS =  [{
  id:   1,
  name: 'Gardner Alvarez',
  friends: [{'name': 'Gates Lewis'},{'name': 'Britt Stokes'}]
},{
  id:   2,
  name: 'Gates Lewis',
  friends: [{'name': 'Gardner Alvarez'}]
}];

describe('Render Loops', () => {

  it('should render simple loop', () => {
    const template  = 'Hello {#COL1}a{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello aaa');
  });

  it('should render consecutive loops', () => {
    const template  = 'Hello {#COL1}{.}{/COL1} {#COL1}{.}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello 123 123');
  });

  it('should render nested loops', () => {
    const template  = 'Hello {#COL1}{.}{#COL2}{.}{/COL2} {/COL1}';
    const r         = new Renderer().render(template, { COL1, COL2 });
    assert.equal(r, 'Hello 1ab 2ab 3ab ');
  });

  it('should render nested loops with .', () => {
    const template  = 'Hello {#COL1}{.}{#COL2}{.}{/COL2} {/COL1}';
    const r         = new Renderer().render(template, { COL1, COL2 });
    assert.equal(r, 'Hello 1ab 2ab 3ab ');
  });

  it('should render if not an array', () => {
    const template  = 'Hello {#COL1}a{.}{/COL1}';
    const r         = new Renderer().render(template, { COL1: 1 });
    assert.equal(r, 'Hello a1');
  });

  it('should render else if null', () => {
    const template  = 'Hello {#COL1}a{:else}b{/COL1}';
    const r         = new Renderer().render(template, { COL1: null });
    assert.equal(r, 'Hello b');
  });

  it('should render else if emty', () => {
    const template  = 'Hello {#COL1}a{:else}b{/COL1}';
    const r         = new Renderer().render(template, { COL1: [] });
    assert.equal(r, 'Hello b');
  });

  it('should render nested loops on "it"', () => {
    const template  = 'Hello {#COL0}z{#.}x{.}{/.}{/COL0}';
    const r         = new Renderer().render(template, { COL0: [COL1, COL2] });
    assert.equal(r, 'Hello zx1x2x3zxaxb');
  });

  it('should render nested loops on "."', () => {
    const template  = 'Hello {#COL0}z{#.}x{.}{/.}{/COL0}';
    const r         = new Renderer().render(template, { COL0: [COL1, COL2] });
    assert.equal(r, 'Hello zx1x2x3zxaxb');
  });

  it('should render loops with check on "."', () => {
    const template  = 'Hello {#COL0}{?.a}{.b}{/.a}{/COL0}';
    const r         = new Renderer().render(template, { COL0: [{a: false, b: 'False'}, {a: true, b: 'True'}] });
    assert.equal(r, 'Hello True');
  });

  it('should render loop with @first', () => {
    const template  = 'Hello {#COL1}A{@first}{.}{/first}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello A1AA');
  });

  it('should render loop with @last', () => {
    const template  = 'Hello {#COL1}A{@last}{.}{/last}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello AAA3');
  });

  it('should render loop with @sep', () => {
    const template  = 'Hello {#COL1}A{@sep}{.},{/sep}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello A1,A2,A');
  });

  it('should render loop with params', () => {
    const template  = 'Hello {#COL1 w="World"}World{@sep}{.},{/sep}{/COL1}';
    const r         = new Renderer().render(template, { COL1 });
    assert.equal(r, 'Hello World1,World2,World');
  });

  it('should render loops inside includes', () => {
    const template  = 'Hello {> "./test/templates/_array" world=w}.';
    const r         = new Renderer().render(template, { w: 'World', array: COL1});
    assert.equal(r, 'Hello World 1, World 2, World 3.');
  });

  it('should render complex loops', () => {
    const template  = '{#friends}#{.id} {.name}: {#.friends}{.name}{@sep}, {/sep}{/.friends}{@sep}<br/>{/sep}{/friends}';
    const r         = new Renderer().render(template, { friends: FRIENDS});
    assert.equal(r, '#1 Gardner Alvarez: Gates Lewis, Britt Stokes<br/>#2 Gates Lewis: Gardner Alvarez');
  });

  it('should pass it at param', () => {
    const template  = 'Hello {#COL2}A{> "./test/templates/_world_ref" world=.}{@sep} {/sep}{/COL2}';
    const r         = new Renderer().render(template, { COL2 });
    assert.equal(r, 'Hello Aa! Ab!');
  });

  it('should pass it attribute as param', () => {
    const template  = 'Hello {#COL}A{> "./test/templates/_world_ref" world=.a}{@sep} {/sep}{/COL}';
    const r         = new Renderer().render(template, {COL: [ {a: 1}, {a: 2}] });
    assert.equal(r, 'Hello A1! A2!');
  });

  it('should rename it', () => {
    const template  = 'Hello {#users it="user"}{user.id}{@sep}, {/sep}{/users}!';
    const r         = new Renderer().render(template, {users: [ {id: 1}, {id: 2}] });
    assert.equal(r, 'Hello 1, 2!');
  });

  it('should rename nested it', () => {
    const template  = 'Hello {#users it="user"}#{user.id}: {#user.friends it="friend"}{friend.name}{@sep}, {/sep}{/user.friends} #{user.id}{@sep}<br/>{/sep}{/users}';
    const r         = new Renderer().render(template, { users: FRIENDS});
    assert.equal(r, 'Hello #1: Gates Lewis, Britt Stokes #1<br/>#2: Gardner Alvarez #2');
  });

  it('should rename only first it', () => {
    const template  = 'Hello {#users it="user"}#{user.id}: {#user.friends}{.name}{@sep}, {/sep}{/user.friends} #{user.id}{@sep}<br/>{/sep}{/users}';
    const r         = new Renderer().render(template, { users: FRIENDS});
    assert.equal(r, 'Hello #1: Gates Lewis, Britt Stokes #1<br/>#2: Gardner Alvarez #2');
  });

  it('should allow nested custom it', () => {
    const template  = 'Hello {#user}{#.friends it="user"}#{user.id} {/.friends}{/user}';
    const r         = new Renderer().render(template, { user: { friends: FRIENDS }});
    assert.equal(r, 'Hello #1 #2 ');
  });

  it('should allow . notation in nested loop even with it param', () => {
    const template  = 'Hello {#users}{#.friends it="user"}#{.id} {/.friends}{/users}';
    const r         = new Renderer().render(template, { users: [{ friends: FRIENDS }]});
    assert.equal(r, 'Hello #1 #2 ');
  });

  it('should not loop if no buffer', () => {
    const template  = 'Hello {#COL1 /}';
    const r         = new Renderer().render(template, { COL1: 1 });
    assert.equal(r, 'Hello 1');
  });

  it('should restore locals after loop', () => {
    const template  = 'Hello {#COL1 world=2}{world}{/COL1} {world}';
    const r         = new Renderer().render(template, { COL1, world: 'World' });
    assert.equal(r, 'Hello 222 World');
  });

  it('should execute function if tag is a function', () => {
    const template  = 'Hello {#t key="World" /}';
    const r         = new Renderer().render(template, { t: (params) => params.key });
    assert.equal(r, 'Hello World');
  });

});


