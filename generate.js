'use strict';

const path = require('path');
const async = require('async');
const fs = require('fs');
const IgoDust = require('igo-dust');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const DEST_DIR = path.join(__dirname, 'docs');

async.waterfall([
    function (cb){
      fs.readdir(TEMPLATES_DIR, cb);
    },
    function (files, cb) {
      const ret = files.filter(t => !t.startsWith('_') && t.endsWith('.dust'));
      process.nextTick(function (){
        cb(null, ret);
      })
    },
    function (files, cb) {
      async.eachSeries(templates, (template, callback) => {
        IgoDust.engine(`${TEMPLATES_DIR}/${template}`, {}, (err, html) => {
          if (err) {
            console.error(`Error rendering template ${TEMPLATES_DIR}/${template} - %s`, err.message);
            return callback(err);
          }
          const dest = `${DEST_DIR}/${template.replace('.dust', '.html')}`;
          fs.writeFile(dest, html, function (err) {
            if (err) {
              console.error(`Error saving rendered template ${TEMPLATES_DIR}/${template} to file - %s`, err.message);
              return callback(err);
            }
            console.log(`Template >>>${template}<<< rendered to ${dest}`);
            callback();
          });
        });
      }, cb);
    }
], function (err) {
  if (err) {
    throw err;
  }
  console.log('Done.');
  process.exit(0);
})


