var assert = require('assert');

const Renderer = require('../../src/render/Renderer');

describe('Render curly brace', function () {
	it('should render a left curly brace', () => {
		const template 	=	'{~lb}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '{');
	});

	it('should render a right curly brace', () => {
		const template 	=	'{~rb}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '}');
	});

	it('should render nothing, bad tag after ~', () => {
		const template 	=	'{~t}';
		const data 			=	{ a: 'aaaa' };
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '');
	});

	it('should render multiple curly brace \'{}{}}{\'', () => {
		const template 	=	'{~lb}{~rb}{~lb}{~rb}{~rb}{~lb}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '{}{}}{');
	});

	it('should render curly brace with content \'{test}{}}aaaa{\'', () => {
		const template 	=	'{~lb}test{~rb}{~lb}{~rb}{~rb}{a}{~lb}';
		const data 			=	{ a: 'aaaa' };
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '{test}{}}aaaa{');
	});

	it('should render tilder between two curly brace \'{~lb} print a {\'', () => {
		const template 	=	'{~lb}~lb{~rb} print a {~lb}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '{~lb} print a {');
	});

	it('should render curly brace inside of a helper', () => {
		const template 	=	'{@eq key=level value="master"}You are no longer a {~lb}Padawan{~rb}.{/eq}';
		const data 			=	{ level: 'master' };
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, 'You are no longer a {Padawan}.');
	});
});

describe('Render space', function () {
	it('should render a space', () => {
		const template 	=	'{~s}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, ' ');
	});

	it('should render multiple space', () => {
		const template 	=	'start{~s}{~s}test{~s}end';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, 'start  test end');
	});

	it('should render multiple space inside a helper', () => {
		const template 	=	'{@eq key=level value="master"}You{~s}are{~s}no{~s}longer{~s}a{~s}Padawan.{/eq}';
		const data 			=	{ level: 'master' };
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, 'You are no longer a Padawan.');
	});
});

describe('Render new line', function () {
	
	it('should render a new line', () => {
		const template 	=	'{~n}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '\n');
	});

	it('should render multiple new line', () => {
		const template 	=	'1{~n}2{~n}{~n}3{~n}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '1\n2\n\n3\n');
	});

	it('should render multiple space inside a helper', () => {
		const template 	=	'{@eq key=level value="master"}You{~n}are{~n}no{~n}longer{~n}a{~n}Padawan.{/eq}';
		const data 			=	{ level: 'master' };
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, 'You\nare\nno\nlonger\na\nPadawan.');
	});
});

describe('Render carriage return', function () {
	
	it('should render a carriage return', () => {
		const template 	=	'{~r}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '\r\n');
	});

	it('should render multiple carriage return', () => {
		const template 	=	'1{~r}2{~r}{~r}3{~r}';
		const data 			=	{};
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, '1\r\n2\r\n\r\n3\r\n');
	});

	it('should render multiple space inside a helper', () => {
		const template 	=	'{@eq key=level value="master"}You{~r}are{~r}no{~r}longer{~r}a{~r}Padawan.{/eq}';
		const data 			=	{ level: 'master' };
		const r 				=	new Renderer().render(template, data);
		assert.equal(r, 'You\r\nare\r\nno\r\nlonger\r\na\r\nPadawan.');
	});
})