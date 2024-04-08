
/* global describe, it */

const assert    = require('assert');

const FileUtils = require('../../src/fs/FileUtils');
const Renderer  = require('../../src/render/Renderer');

//
describe('Render Files', () => {

  it('should render email template with css', () => {
    const r   = new Renderer().renderFile('./test/templates/email.dust', {});
    assert(r.match(/img {/));
    assert(r.match(/tr > td {/));
  });
  
});