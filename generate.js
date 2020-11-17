
const TEMPLATES_DIR = './templates';
const DEST_DIR      = './www';

const async   = require('async');
const fs      = require('fs');

const IgoDust = require('igo-dust');

const templates = fs.readdirSync(TEMPLATES_DIR)
                    .filter(t => !t.startsWith('_') && t.endsWith('.dust'));

async.eachSeries(templates, (template, callback) => {
  IgoDust.engine(`${TEMPLATES_DIR}/${template}`, {}, (err, html) => {
    const dest = `${DEST_DIR}/${template.replace('.dust', '.html')}`;
    fs.writeFileSync(dest, html);
    console.log(`rendered ${dest}`);
    callback();
  });
}, (err) => {
  console.log('Done.')
});

