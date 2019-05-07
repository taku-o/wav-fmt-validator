interface Chunk {
  chunkLength: number;
  id: string;
  size: number;
  isValid(): boolean;
  dump(offset: number): any;
}

/**
 * RIFF
 */
export class Riff implements Chunk {
  chunkLength: number;
  id: string = 'RIFF';
  size: number;
  format: string = 'WAVE';
  subChunks: Chunk[] = [];

  constructor() {}
  static isChunk(buffer: Buffer) {
    const id = buffer.readUIntBE(0, 4);
    const idName = Buffer.from(id.toString(16), 'hex').toString();
    return idName == 'RIFF';
  }
  static from(buffer: Buffer) {
    const chunk = new Riff();
    // 1-4 Chunk ID "RIFF"
    chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
    // 5-8 Chunk Size
    chunk.size = buffer.readUIntLE(4, 4);
    chunk.chunkLength = chunk.size + 8;
    // 9-12  Format "WAVE"
    chunk.format = Buffer.from(buffer.readUIntBE(8, 4).toString(16), 'hex').toString();
    // 13-   SubChunks
    let pos = 12;
    while (pos < chunk.chunkLength) {
      if (Fmt.isChunk(buffer.slice(pos))) {
        const sub = Fmt.from(buffer.slice(pos));
        chunk.subChunks.push(sub);
        pos += sub.chunkLength;
        continue;
      } else if (WavData.isChunk(buffer.slice(pos))) {
        const sub = WavData.from(buffer.slice(pos));
        chunk.subChunks.push(sub);
        pos += sub.chunkLength;
        continue;
      } else {
        break;
      }
    }
    // return
    return chunk;
  }
  isValid(): boolean {
    // value
    if (!Boolean(this.id && this.size && this.format)) {
      throw new Error('RIFF chunk id, size or format is not contained. invalid format.');
    }
    if (this.id != 'RIFF') {
      throw new Error(`RIFF chunk id is not RIFF. invalid format. id:${this.id}`);
    }
    if (this.format != 'WAVE') {
      throw new Error(`RIFF chunk format is not WAVE. invalid format. format:${this.format}`);
    }
    // length
    let sumChunkLength = 0;
    for (let chunk of this.subChunks) {
      sumChunkLength += chunk.chunkLength;
    }
    // TODO
    //if ((this.chunkLength - 12) != sumChunkLength) {
    //  throw new Error(`RIFF chunk chunkLength is not valid length, or sub chunk is broken. invalid format. declared chunkLength:${this.chunkLength}, header size:12, sum chunkLength:${sumChunkLength}`);
    //}
    // sub chunk
    for (let chunk of this.subChunks) {
      if (!chunk.isValid()) {
        return false;
      }
    }
    return true;
  }
  dump(offset: number): any {
    if (!this.isValid()) {
      return false;
    }
    let tables = [];
    tables.push({position: offset, length: 4, header: 'Chunk ID "RIFF"', data: this.id});
    tables.push({position: offset + 4, length: 4, header: 'Chunk Size', data: this.size});
    tables.push({position: offset + 8, length: 4, header: 'Format "WAVE"', data: this.format});

    offset = 12;
    for (let chunk of this.subChunks) {
      let tableInfos = chunk.dump(offset);
      tables = tables.concat(tableInfos);
      offset += chunk.chunkLength;
    }
    return tables;
  }
}

/**
 * fmt Chunk
 */
class Fmt implements Chunk {
  chunkLength: number = 24;
  id: string = 'fmt ';
  size: number = 16;
  audioFormat: number = 1;
  numChannels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;

  constructor() {}
  static isChunk(buffer: Buffer) {
    const id = buffer.readUIntBE(0, 4);
    const idName = Buffer.from(id.toString(16), 'hex').toString();
    return idName == 'fmt ';
  }
  static from(buffer: Buffer) {
    const chunk = new Fmt();
    // 1-4 Subchunk1 ID "fmt"
    chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
    // 5-8 Subchunk1 Size "16"
    chunk.size = buffer.readUIntLE(4, 4);
    // 9-10 Audio Format "1"
    chunk.audioFormat = buffer.readUIntLE(8, 2);
    // 11-12 Num Channels
    chunk.numChannels = buffer.readUIntLE(10, 2);
    // 13-16 Sample Rate
    chunk.sampleRate = buffer.readUIntLE(12, 4);
    // 17-20 Byte Rate
    chunk.byteRate = buffer.readUIntLE(16, 4);
    // 21-22 Block Align
    chunk.blockAlign = buffer.readUIntLE(20, 2);
    // 23-24 Bits Per Sample
    chunk.bitsPerSample = buffer.readUIntLE(22, 2);
    // return
    return chunk;
  }
  isValid(): boolean {
    if (
      !Boolean(
        this.id &&
          this.size &&
          this.audioFormat &&
          this.numChannels &&
          this.sampleRate &&
          this.byteRate &&
          this.blockAlign &&
          this.bitsPerSample,
      )
    ) {
      throw new Error(
        'fmt chunk id, size, audioFormat, numChannels, sampleRate, byteRate, blockAlign or bitsPerSample is not contained. invalid format.',
      );
    }
    if (this.id != 'fmt ') {
      throw new Error(`fmt chunk format is not fmt. invalid format. id:${this.id}`);
    }
    if (this.size != 16) {
      throw new Error(`fmt chunk size is not 16. invalid format. size:${this.size}`);
    }
    if (this.audioFormat != 1) {
      throw new Error(`fmt chunk audioFormat is not 1. invalid format. audioFormat:${this.audioFormat}`);
    }
    return true;
  }
  dump(offset: number): any {
    if (!this.isValid()) {
      return false;
    }
    let tables = [];
    tables.push({position: offset, length: 4, header: 'Subchunk1 ID "fmt "', data: this.id});
    tables.push({position: offset + 4, length: 4, header: 'Subchunk1 Size', data: this.size});
    tables.push({position: offset + 8, length: 2, header: 'Audio Format "1" PCM', data: this.audioFormat});
    tables.push({position: offset + 10, length: 2, header: 'Num Channels', data: this.numChannels});
    tables.push({position: offset + 12, length: 4, header: 'Sample Rate', data: this.sampleRate});
    tables.push({position: offset + 16, length: 4, header: 'Byte Rate', data: this.byteRate});
    tables.push({position: offset + 20, length: 2, header: 'Block Align', data: this.blockAlign});
    tables.push({position: offset + 22, length: 2, header: 'Bits Per Sample', data: this.bitsPerSample});
    return tables;
  }
}

/**
 * Wave Data Chunk
 */
class WavData implements Chunk {
  chunkLength: number;
  id: string = 'data';
  size: number;
  wavBuffer: Buffer;

  constructor() {}
  static isChunk(buffer: Buffer) {
    const id = buffer.readUIntBE(0, 4);
    const idName = Buffer.from(id.toString(16), 'hex').toString();
    return idName == 'data';
  }
  static from(buffer: Buffer) {
    const chunk = new WavData();
    // 1-4 Subchunk2 ID "data"
    chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
    // 5-8 Subchunk2 Size
    chunk.size = buffer.readUIntLE(4, 4);
    chunk.chunkLength = chunk.size + 8;
    // 9-   Subchunk2 data
    chunk.wavBuffer = buffer.slice(8, chunk.size);
    // return
    return chunk;
  }
  isValid(): boolean {
    // value
    if (!Boolean(this.id && this.size && this.wavBuffer)) {
      throw new Error('data chunk id, size or data is not contained. invalid format.');
    }
    if (this.id != 'data') {
      throw new Error(`data chunk id is not data. invalid format. id:${this.id}`);
    }
    // length
    // TODO
    //if (this.wavBuffer.length != this.size) {
    //  throw new Error(`data chunk chunkLength is not valid length. invalid format. declared chunkLength:${this.chunkLength}, header size:8, buffer length:${this.wavBuffer.length}`);
    //}
    return true;
  }
  dump(offset: number): any {
    if (!this.isValid()) {
      return false;
    }
    let tables = [];
    tables.push({position: offset, length: 4, header: 'Subchunk2 ID "data"', data: this.id});
    tables.push({position: offset + 4, length: 4, header: 'Subchunk2 Size', data: this.size});
    tables.push({position: offset + 8, length: this.size, header: 'Wave Data', data: '******'});
    return tables;
  }
}
