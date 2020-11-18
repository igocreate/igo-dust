'use strict';
/* global describe, it */

const assert  = require('assert');

const ParseUtils  = require('../../src/parse/ParseUtils');

describe('ParseUtils', () => {
  it('should parse params', () => {
    const tag = '> "hello world" a="azer ty" b=user.name c="hello {world}" ';
    const params = ParseUtils.parseParams(tag);

    assert.equal(params.$, '"hello world"');
    assert.equal(params.a, '"azer ty"');
    assert.equal(params.b, 'user.name');
    assert.equal(params.c, '"hello {world}"');

  });
});
