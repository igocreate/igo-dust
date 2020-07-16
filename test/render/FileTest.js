const assert    = require('assert');

const FileUtils = require('../../src/fs/FileUtils');
const Renderer  = require('../../src/render/Renderer');

//
describe('Render Files', () => {

  it('should render email template with css', () => {
    const src = FileUtils.loadFile('./templates/email.dust');
    const r   = new Renderer().render(src, {});
    assert(r.match(/img {/));
    assert(r.match(/tr > td {/));
  });
  
});