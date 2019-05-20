"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const riff_1 = require("./riff");
const cTable = require('console.table');
function validator(wavBuffer) {
    let chunk = riff_1.Riff.from(wavBuffer);
    return chunk.isValid();
}
exports.validator = validator;
function parser(wavBuffer) {
    let chunk = riff_1.Riff.from(wavBuffer);
    return cTable.getTable(chunk.dump(0));
}
exports.parser = parser;
