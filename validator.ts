import {Riff} from './riff';
const cTable = require('console.table');

function validator(wavBuffer: Buffer): boolean {
  let chunk = Riff.from(wavBuffer);
  return chunk.isValid();
}

function parser(wavBuffer: Buffer): string {
  let chunk = Riff.from(wavBuffer);
  return cTable.getTable(chunk.dump(0));
}

export {validator, parser};
