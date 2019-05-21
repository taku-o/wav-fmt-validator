"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
var fs = require('fs');
var wavParser = require('../validator').parser;
var wavValidator = require('../validator').validator;
require('source-map-support').install();
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
            chai_1.assert.ok(result);
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
                chai_1.assert.ok(false);
            }
            catch (e) {
                chai_1.assert.ok(true);
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
            chai_1.assert.ok(result);
            cb();
        });
    });
});
describe('validator', () => {
    it('should validate wav audio file.', (cb) => {
        const wavFile = './test/sample-wav.wav';
        fs.readFile(wavFile, 'binary', (err, content) => {
            if (err) {
                return cb(err);
            }
            let buffer = Buffer.from(content, 'binary');
            const result = wavValidator(buffer);
            chai_1.assert.ok(result);
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
                chai_1.assert.ok(false);
            }
            catch (e) {
                chai_1.assert.ok(true);
            }
            cb();
        });
    });
    it('should validate wav audio file with iXML chunk.', (cb) => {
        const wavFile = './test/with-ixml-left.wav';
        fs.readFile(wavFile, 'binary', (err, content) => {
            if (err) {
                return cb(err);
            }
            let buffer = Buffer.from(content, 'binary');
            const result = wavValidator(buffer);
            chai_1.assert.ok(result);
            cb();
        });
    });
});
