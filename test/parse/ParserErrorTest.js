'use strict';
/* global describe, it */

const assert  = require('assert');

const Parser  = require('../../src/parse/Parser');

describe('Parser', () => {

  it('should throw error when missing closing tag', () => {
    const TEMPLATE = 'Hello {world ok.';
    try {
      new Parser().parse(TEMPLATE);
      assert.fail();
    } catch(err) {
      assert.equal(err.message, 'Missing closing "}" at index 7');
    }
  });

  it('should throw error for single quotes in param', () => {
    const TEMPLATE = 'Hello {@eq key=o value=\'oo\'}world{/eq}.';
    try {
      new Parser().parse(TEMPLATE);
      assert.fail();
    } catch(err) {
      assert.equal(err.message, 'Unexpected character "\'" in tag {@eq key=o value=\'oo\'...');
    }
  });


  it('should throw error for curly bracket in tag', () => {
    const TEMPLATE = 'Hello {@eq key=o value={oo}}world{/eq}.';
    try {
      new Parser().parse(TEMPLATE);
      assert.fail();
    } catch(err) {
      assert.equal(err.message, 'Unexpected character "{" in tag {@eq key=o value={oo}...');
    }
  });
  
});
