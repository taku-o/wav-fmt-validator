import {assert} from 'chai';
var fs = require('fs');
var wavParser = require('../validator').parser;
var wavValidator = require('../validator').validator;

require('source-map-support').install();

// parser
describe('parser', () => {
  it('should return parsed audio data.', (cb) => {
    const wavFile = './test/sample-wav.wav';
    fs.readFile(wavFile, 'binary', (err, content) => {
      if (err) {
        return cb(err);
      }
      let buffer = Buffer.from(content, 'binary');
      const result = wavParser(buffer);
      console.log(result);
      assert.ok(result);
      cb();
    });
  });

  it('should throw error to parse invalid audio data.', (cb) => {
    const wavFile = './test/invalid-wav.wav';
    fs.readFile(wavFile, 'binary', (err, content) => {
      if (err) {
        return cb(err);
      }
      let buffer = Buffer.from(content, 'binary');
      try {
        const result = wavParser(buffer);
        assert.ok(false);
      } catch (e) {
        assert.ok(true);
      }
      cb();
    });
  });

  it('should return parsed audio data with iXML chunk.', (cb) => {
    const wavFile = './test/with-ixml-left.wav';
    fs.readFile(wavFile, 'binary', (err, content) => {
      if (err) {
        return cb(err);
      }
      let buffer = Buffer.from(content, 'binary');
      const result = wavParser(buffer);
      console.log(result);
      assert.ok(result);
      cb();
    });
  });
});

// validator
describe('validator', () => {
  it('should validate wav audio file.', (cb) => {
    const wavFile = './test/sample-wav.wav';
    fs.readFile(wavFile, 'binary', (err, content) => {
      if (err) {
        return cb(err);
      }
      let buffer = Buffer.from(content, 'binary');
      const result = wavValidator(buffer);
      assert.ok(result);
      cb();
    });
  });

  it('should throw error to parse invalid audio data.', (cb) => {
    const wavFile = './test/invalid-wav.wav';
    fs.readFile(wavFile, 'binary', (err, content) => {
      if (err) {
        return cb(err);
      }
      let buffer = Buffer.from(content, 'binary');
      try {
        const result = wavValidator(buffer);
        assert.ok(false);
      } catch (e) {
        assert.ok(true);
      }
      cb();
    });
  });

  // TODO
  it('should validate wav audio file with iXML chunk.', (cb) => {
    const wavFile = './test/with-ixml-left.wav';
    fs.readFile(wavFile, 'binary', (err, content) => {
      if (err) {
        return cb(err);
      }
      let buffer = Buffer.from(content, 'binary');
      const result = wavValidator(buffer);
      assert.ok(result);
      cb();
    });
  });
});
