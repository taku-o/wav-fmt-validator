"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Riff {
    constructor() {
        this.id = 'RIFF';
        this.format = 'WAVE';
        this.subChunks = [];
    }
    static isChunk(buffer) {
        if (buffer.length < 4) {
            return false;
        }
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'RIFF';
    }
    static from(buffer) {
        const chunk = new Riff();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.chunkLength = chunk.size + 8;
        chunk.format = Buffer.from(buffer.readUIntBE(8, 4).toString(16), 'hex').toString();
        let pos = 12;
        while (pos < chunk.chunkLength) {
            if (Fmt.isChunk(buffer.slice(pos))) {
                const sub = Fmt.from(buffer.slice(pos));
                chunk.subChunks.push(sub);
                pos += sub.chunkLength;
                continue;
            }
            else if (WavData.isChunk(buffer.slice(pos))) {
                const sub = WavData.from(buffer.slice(pos));
                chunk.subChunks.push(sub);
                pos += sub.chunkLength;
                continue;
            }
            else if (iXMLChunk.isChunk(buffer.slice(pos))) {
                const sub = iXMLChunk.from(buffer.slice(pos));
                chunk.subChunks.push(sub);
                pos += sub.chunkLength;
                continue;
            }
            else {
                break;
            }
        }
        return chunk;
    }
    isValid() {
        if (!Boolean(this.id && this.size && this.format)) {
            throw new Error('RIFF chunk id, size or format is not contained. invalid format.');
        }
        if (this.id != 'RIFF') {
            throw new Error(`RIFF chunk id is not RIFF. invalid format. id:${this.id}`);
        }
        if (this.format != 'WAVE') {
            throw new Error(`RIFF chunk format is not WAVE. invalid format. format:${this.format}`);
        }
        for (let chunk of this.subChunks) {
            if (!chunk.isValid()) {
                return false;
            }
        }
        let sumChunkLength = 0;
        for (let chunk of this.subChunks) {
            sumChunkLength += chunk.chunkLength;
        }
        if ((this.chunkLength - 12) != sumChunkLength) {
            throw new Error(`RIFF chunk chunkLength is not valid length, or sub chunk is broken. invalid format.
        declared size:${this.size},
        chunkLength:${this.chunkLength},
        header size:12,
        sum chunkLength:${sumChunkLength}`);
        }
        return true;
    }
    dump(offset, force = false) {
        if (!force) {
            if (!this.isValid()) {
                return false;
            }
        }
        let tables = [];
        tables.push({ position: offset, length: 4, header: 'Chunk ID "RIFF"', data: this.id });
        tables.push({ position: offset + 4, length: 4, header: 'Chunk Size', data: this.size });
        tables.push({ position: offset + 8, length: 4, header: 'Format "WAVE"', data: this.format });
        offset = 12;
        for (let chunk of this.subChunks) {
            let tableInfos = chunk.dump(offset, force);
            tables = tables.concat(tableInfos);
            offset += chunk.chunkLength;
        }
        return tables;
    }
}
exports.Riff = Riff;
class Fmt {
    constructor() {
        this.chunkLength = 24;
        this.id = 'fmt ';
        this.size = 16;
        this.audioFormat = 1;
    }
    static isChunk(buffer) {
        if (buffer.length < 4) {
            return false;
        }
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'fmt ';
    }
    static from(buffer) {
        const chunk = new Fmt();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.audioFormat = buffer.readUIntLE(8, 2);
        chunk.numChannels = buffer.readUIntLE(10, 2);
        chunk.sampleRate = buffer.readUIntLE(12, 4);
        chunk.byteRate = buffer.readUIntLE(16, 4);
        chunk.blockAlign = buffer.readUIntLE(20, 2);
        chunk.bitsPerSample = buffer.readUIntLE(22, 2);
        return chunk;
    }
    isValid() {
        if (!Boolean(this.id &&
            this.size &&
            this.audioFormat &&
            this.numChannels &&
            this.sampleRate &&
            this.byteRate &&
            this.blockAlign &&
            this.bitsPerSample)) {
            throw new Error('fmt chunk id, size, audioFormat, numChannels, sampleRate, byteRate, blockAlign or bitsPerSample is not contained. invalid format.');
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
    dump(offset, force = false) {
        if (!force) {
            if (!this.isValid()) {
                return false;
            }
        }
        let tables = [];
        tables.push({ position: offset, length: 4, header: 'Subchunk1 ID "fmt "', data: this.id });
        tables.push({ position: offset + 4, length: 4, header: 'Subchunk1 Size', data: this.size });
        tables.push({ position: offset + 8, length: 2, header: 'Audio Format "1" PCM', data: this.audioFormat });
        tables.push({ position: offset + 10, length: 2, header: 'Num Channels', data: this.numChannels });
        tables.push({ position: offset + 12, length: 4, header: 'Sample Rate', data: this.sampleRate });
        tables.push({ position: offset + 16, length: 4, header: 'Byte Rate', data: this.byteRate });
        tables.push({ position: offset + 20, length: 2, header: 'Block Align', data: this.blockAlign });
        tables.push({ position: offset + 22, length: 2, header: 'Bits Per Sample', data: this.bitsPerSample });
        return tables;
    }
}
class WavData {
    constructor() {
        this.id = 'data';
    }
    static isChunk(buffer) {
        if (buffer.length < 4) {
            return false;
        }
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'data';
    }
    static from(buffer) {
        const chunk = new WavData();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.chunkLength = chunk.size + 8;
        chunk.wavBuffer = buffer.slice(8, chunk.size + 8);
        return chunk;
    }
    isValid() {
        if (!Boolean(this.id && this.size && this.wavBuffer)) {
            throw new Error('data chunk id, size or data is not contained. invalid format.');
        }
        if (this.id != 'data') {
            throw new Error(`data chunk id is not data. invalid format. id:${this.id}`);
        }
        if (this.wavBuffer.length != this.size) {
            throw new Error(`data chunk chunkLength is not valid length. invalid format.
        declared size:${this.size},
        chunkLength:${this.chunkLength},
        header size:8,
        buffer length:${this.wavBuffer.length}`);
        }
        return true;
    }
    dump(offset, force = false) {
        if (!force) {
            if (!this.isValid()) {
                return false;
            }
        }
        let tables = [];
        tables.push({ position: offset, length: 4, header: 'Subchunk2 ID "data"', data: this.id });
        tables.push({ position: offset + 4, length: 4, header: 'Subchunk2 Size', data: this.size });
        tables.push({ position: offset + 8, length: this.size, header: 'Wave Data', data: '******' });
        return tables;
    }
}
class iXMLChunk {
    constructor() { }
    static isChunk(buffer) {
        if (buffer.length < 4) {
            return false;
        }
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'iXML';
    }
    static from(buffer) {
        const chunk = new iXMLChunk();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.chunkLength = chunk.size + 8;
        chunk.wavBuffer = buffer.slice(8, chunk.size + 8);
        return chunk;
    }
    isValid() {
        if (!Boolean(this.id && this.size && this.wavBuffer)) {
            throw new Error('iXML chunk id, size or data is not contained. invalid format.');
        }
        if (this.id != 'iXML') {
            throw new Error(`iXML chunk id is not iXML. invalid format. id:${this.id}`);
        }
        if (this.wavBuffer.length != this.size) {
            throw new Error(`iXML chunk chunkLength is not valid length. invalid format.
        declared size:${this.size},
        chunkLength:${this.chunkLength},
        header size:8,
        buffer length:${this.wavBuffer.length}`);
        }
        return true;
    }
    dump(offset, force = false) {
        if (!force) {
            if (!this.isValid()) {
                return false;
            }
        }
        let tables = [];
        tables.push({ position: offset, length: 4, header: 'iXML Chumk ID', data: this.id });
        tables.push({ position: offset + 4, length: 4, header: 'iXML Chunk Size', data: this.size });
        tables.push({ position: offset + 8, length: this.size, header: 'Chunk Data', data: this.wavBuffer.toString() });
        return tables;
    }
}
