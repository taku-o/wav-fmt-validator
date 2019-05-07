#!/usr/bin/env node
var fs = require('fs');
var wavParser = require('../validator').parser;

// params
const args = process.argv.slice(2);
if (args.length < 1) {
  process.exit(1);
}
const wavFile = args[0];

// parser and print out
fs.readFile(wavFile, 'binary', (err, content) => {
  if (err) {
    console.error(err);
    return;
  }
  let buffer = Buffer.from(content, 'binary');
  console.log(wavParser(buffer));
});
