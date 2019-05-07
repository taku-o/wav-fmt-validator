"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Riff {
    constructor() {
        this.id = 'RIFF';
        this.format = 'WAVE';
        this.subChunks = [];
    }
    static isChunk(buffer) {
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
        let sumChunkLength = 0;
        for (let chunk of this.subChunks) {
            sumChunkLength += chunk.chunkLength;
        }
        for (let chunk of this.subChunks) {
            if (!chunk.isValid()) {
                return false;
            }
        }
        return true;
    }
    dump(offset) {
        if (!this.isValid()) {
            return false;
        }
        let tables = [];
        tables.push({ position: offset, length: 4, header: 'Chunk ID "RIFF"', data: this.id });
        tables.push({ position: offset + 4, length: 4, header: 'Chunk Size', data: this.size });
        tables.push({ position: offset + 8, length: 4, header: 'Format "WAVE"', data: this.format });
        offset = 12;
        for (let chunk of this.subChunks) {
            let tableInfos = chunk.dump(offset);
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
    dump(offset) {
        if (!this.isValid()) {
            return false;
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
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'data';
    }
    static from(buffer) {
        const chunk = new WavData();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.chunkLength = chunk.size + 8;
        chunk.wavBuffer = buffer.slice(8, chunk.size);
        return chunk;
    }
    isValid() {
        if (!Boolean(this.id && this.size && this.wavBuffer)) {
            throw new Error('data chunk id, size or data is not contained. invalid format.');
        }
        if (this.id != 'data') {
            throw new Error(`data chunk id is not data. invalid format. id:${this.id}`);
        }
        return true;
    }
    dump(offset) {
        if (!this.isValid()) {
            return false;
        }
        let tables = [];
        tables.push({ position: offset, length: 4, header: 'Subchunk2 ID "data"', data: this.id });
        tables.push({ position: offset + 4, length: 4, header: 'Subchunk2 Size', data: this.size });
        tables.push({ position: offset + 8, length: this.size, header: 'Wave Data', data: '******' });
        return tables;
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztRQUN6RixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzFGLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQzVGLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRiIsImZpbGUiOiJyaWZmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIENodW5rIHtcbiAgY2h1bmtMZW5ndGg6IG51bWJlcjtcbiAgaWQ6IHN0cmluZztcbiAgc2l6ZTogbnVtYmVyO1xuICBpc1ZhbGlkKCk6IGJvb2xlYW47XG4gIGR1bXAob2Zmc2V0OiBudW1iZXIpOiBhbnk7XG59XG5cbi8qKlxuICogUklGRlxuICovXG5leHBvcnQgY2xhc3MgUmlmZiBpbXBsZW1lbnRzIENodW5rIHtcbiAgY2h1bmtMZW5ndGg6IG51bWJlcjtcbiAgaWQ6IHN0cmluZyA9ICdSSUZGJztcbiAgc2l6ZTogbnVtYmVyO1xuICBmb3JtYXQ6IHN0cmluZyA9ICdXQVZFJztcbiAgc3ViQ2h1bmtzOiBDaHVua1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuICBzdGF0aWMgaXNDaHVuayhidWZmZXI6IEJ1ZmZlcikge1xuICAgIGNvbnN0IGlkID0gYnVmZmVyLnJlYWRVSW50QkUoMCwgNCk7XG4gICAgY29uc3QgaWROYW1lID0gQnVmZmVyLmZyb20oaWQudG9TdHJpbmcoMTYpLCAnaGV4JykudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gaWROYW1lID09ICdSSUZGJztcbiAgfVxuICBzdGF0aWMgZnJvbShidWZmZXI6IEJ1ZmZlcikge1xuICAgIGNvbnN0IGNodW5rID0gbmV3IFJpZmYoKTtcbiAgICAvLyAxLTQgQ2h1bmsgSUQgXCJSSUZGXCJcbiAgICBjaHVuay5pZCA9IEJ1ZmZlci5mcm9tKGJ1ZmZlci5yZWFkVUludEJFKDAsIDQpLnRvU3RyaW5nKDE2KSwgJ2hleCcpLnRvU3RyaW5nKCk7XG4gICAgLy8gNS04IENodW5rIFNpemVcbiAgICBjaHVuay5zaXplID0gYnVmZmVyLnJlYWRVSW50TEUoNCwgNCk7XG4gICAgY2h1bmsuY2h1bmtMZW5ndGggPSBjaHVuay5zaXplICsgODtcbiAgICAvLyA5LTEyICBGb3JtYXQgXCJXQVZFXCJcbiAgICBjaHVuay5mb3JtYXQgPSBCdWZmZXIuZnJvbShidWZmZXIucmVhZFVJbnRCRSg4LCA0KS50b1N0cmluZygxNiksICdoZXgnKS50b1N0cmluZygpO1xuICAgIC8vIDEzLSAgIFN1YkNodW5rc1xuICAgIGxldCBwb3MgPSAxMjtcbiAgICB3aGlsZSAocG9zIDwgY2h1bmsuY2h1bmtMZW5ndGgpIHtcbiAgICAgIGlmIChGbXQuaXNDaHVuayhidWZmZXIuc2xpY2UocG9zKSkpIHtcbiAgICAgICAgY29uc3Qgc3ViID0gRm10LmZyb20oYnVmZmVyLnNsaWNlKHBvcykpO1xuICAgICAgICBjaHVuay5zdWJDaHVua3MucHVzaChzdWIpO1xuICAgICAgICBwb3MgKz0gc3ViLmNodW5rTGVuZ3RoO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAoV2F2RGF0YS5pc0NodW5rKGJ1ZmZlci5zbGljZShwb3MpKSkge1xuICAgICAgICBjb25zdCBzdWIgPSBXYXZEYXRhLmZyb20oYnVmZmVyLnNsaWNlKHBvcykpO1xuICAgICAgICBjaHVuay5zdWJDaHVua3MucHVzaChzdWIpO1xuICAgICAgICBwb3MgKz0gc3ViLmNodW5rTGVuZ3RoO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyByZXR1cm5cbiAgICByZXR1cm4gY2h1bms7XG4gIH1cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAvLyB2YWx1ZVxuICAgIGlmICghQm9vbGVhbih0aGlzLmlkICYmIHRoaXMuc2l6ZSAmJiB0aGlzLmZvcm1hdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUklGRiBjaHVuayBpZCwgc2l6ZSBvciBmb3JtYXQgaXMgbm90IGNvbnRhaW5lZC4gaW52YWxpZCBmb3JtYXQuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlkICE9ICdSSUZGJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSSUZGIGNodW5rIGlkIGlzIG5vdCBSSUZGLiBpbnZhbGlkIGZvcm1hdC4gaWQ6JHt0aGlzLmlkfWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb3JtYXQgIT0gJ1dBVkUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFJJRkYgY2h1bmsgZm9ybWF0IGlzIG5vdCBXQVZFLiBpbnZhbGlkIGZvcm1hdC4gZm9ybWF0OiR7dGhpcy5mb3JtYXR9YCk7XG4gICAgfVxuICAgIC8vIGxlbmd0aFxuICAgIGxldCBzdW1DaHVua0xlbmd0aCA9IDA7XG4gICAgZm9yIChsZXQgY2h1bmsgb2YgdGhpcy5zdWJDaHVua3MpIHtcbiAgICAgIHN1bUNodW5rTGVuZ3RoICs9IGNodW5rLmNodW5rTGVuZ3RoO1xuICAgIH1cbiAgICAvLyBUT0RPXG4gICAgLy9pZiAoKHRoaXMuY2h1bmtMZW5ndGggLSAxMikgIT0gc3VtQ2h1bmtMZW5ndGgpIHtcbiAgICAvLyAgdGhyb3cgbmV3IEVycm9yKGBSSUZGIGNodW5rIGNodW5rTGVuZ3RoIGlzIG5vdCB2YWxpZCBsZW5ndGgsIG9yIHN1YiBjaHVuayBpcyBicm9rZW4uIGludmFsaWQgZm9ybWF0LiBkZWNsYXJlZCBjaHVua0xlbmd0aDoke3RoaXMuY2h1bmtMZW5ndGh9LCBoZWFkZXIgc2l6ZToxMiwgc3VtIGNodW5rTGVuZ3RoOiR7c3VtQ2h1bmtMZW5ndGh9YCk7XG4gICAgLy99XG4gICAgLy8gc3ViIGNodW5rXG4gICAgZm9yIChsZXQgY2h1bmsgb2YgdGhpcy5zdWJDaHVua3MpIHtcbiAgICAgIGlmICghY2h1bmsuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZHVtcChvZmZzZXQ6IG51bWJlcik6IGFueSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgdGFibGVzID0gW107XG4gICAgdGFibGVzLnB1c2goe3Bvc2l0aW9uOiBvZmZzZXQsIGxlbmd0aDogNCwgaGVhZGVyOiAnQ2h1bmsgSUQgXCJSSUZGXCInLCBkYXRhOiB0aGlzLmlkfSk7XG4gICAgdGFibGVzLnB1c2goe3Bvc2l0aW9uOiBvZmZzZXQgKyA0LCBsZW5ndGg6IDQsIGhlYWRlcjogJ0NodW5rIFNpemUnLCBkYXRhOiB0aGlzLnNpemV9KTtcbiAgICB0YWJsZXMucHVzaCh7cG9zaXRpb246IG9mZnNldCArIDgsIGxlbmd0aDogNCwgaGVhZGVyOiAnRm9ybWF0IFwiV0FWRVwiJywgZGF0YTogdGhpcy5mb3JtYXR9KTtcblxuICAgIG9mZnNldCA9IDEyO1xuICAgIGZvciAobGV0IGNodW5rIG9mIHRoaXMuc3ViQ2h1bmtzKSB7XG4gICAgICBsZXQgdGFibGVJbmZvcyA9IGNodW5rLmR1bXAob2Zmc2V0KTtcbiAgICAgIHRhYmxlcyA9IHRhYmxlcy5jb25jYXQodGFibGVJbmZvcyk7XG4gICAgICBvZmZzZXQgKz0gY2h1bmsuY2h1bmtMZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiB0YWJsZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBmbXQgQ2h1bmtcbiAqL1xuY2xhc3MgRm10IGltcGxlbWVudHMgQ2h1bmsge1xuICBjaHVua0xlbmd0aDogbnVtYmVyID0gMjQ7XG4gIGlkOiBzdHJpbmcgPSAnZm10ICc7XG4gIHNpemU6IG51bWJlciA9IDE2O1xuICBhdWRpb0Zvcm1hdDogbnVtYmVyID0gMTtcbiAgbnVtQ2hhbm5lbHM6IG51bWJlcjtcbiAgc2FtcGxlUmF0ZTogbnVtYmVyO1xuICBieXRlUmF0ZTogbnVtYmVyO1xuICBibG9ja0FsaWduOiBudW1iZXI7XG4gIGJpdHNQZXJTYW1wbGU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHN0YXRpYyBpc0NodW5rKGJ1ZmZlcjogQnVmZmVyKSB7XG4gICAgY29uc3QgaWQgPSBidWZmZXIucmVhZFVJbnRCRSgwLCA0KTtcbiAgICBjb25zdCBpZE5hbWUgPSBCdWZmZXIuZnJvbShpZC50b1N0cmluZygxNiksICdoZXgnKS50b1N0cmluZygpO1xuICAgIHJldHVybiBpZE5hbWUgPT0gJ2ZtdCAnO1xuICB9XG4gIHN0YXRpYyBmcm9tKGJ1ZmZlcjogQnVmZmVyKSB7XG4gICAgY29uc3QgY2h1bmsgPSBuZXcgRm10KCk7XG4gICAgLy8gMS00IFN1YmNodW5rMSBJRCBcImZtdFwiXG4gICAgY2h1bmsuaWQgPSBCdWZmZXIuZnJvbShidWZmZXIucmVhZFVJbnRCRSgwLCA0KS50b1N0cmluZygxNiksICdoZXgnKS50b1N0cmluZygpO1xuICAgIC8vIDUtOCBTdWJjaHVuazEgU2l6ZSBcIjE2XCJcbiAgICBjaHVuay5zaXplID0gYnVmZmVyLnJlYWRVSW50TEUoNCwgNCk7XG4gICAgLy8gOS0xMCBBdWRpbyBGb3JtYXQgXCIxXCJcbiAgICBjaHVuay5hdWRpb0Zvcm1hdCA9IGJ1ZmZlci5yZWFkVUludExFKDgsIDIpO1xuICAgIC8vIDExLTEyIE51bSBDaGFubmVsc1xuICAgIGNodW5rLm51bUNoYW5uZWxzID0gYnVmZmVyLnJlYWRVSW50TEUoMTAsIDIpO1xuICAgIC8vIDEzLTE2IFNhbXBsZSBSYXRlXG4gICAgY2h1bmsuc2FtcGxlUmF0ZSA9IGJ1ZmZlci5yZWFkVUludExFKDEyLCA0KTtcbiAgICAvLyAxNy0yMCBCeXRlIFJhdGVcbiAgICBjaHVuay5ieXRlUmF0ZSA9IGJ1ZmZlci5yZWFkVUludExFKDE2LCA0KTtcbiAgICAvLyAyMS0yMiBCbG9jayBBbGlnblxuICAgIGNodW5rLmJsb2NrQWxpZ24gPSBidWZmZXIucmVhZFVJbnRMRSgyMCwgMik7XG4gICAgLy8gMjMtMjQgQml0cyBQZXIgU2FtcGxlXG4gICAgY2h1bmsuYml0c1BlclNhbXBsZSA9IGJ1ZmZlci5yZWFkVUludExFKDIyLCAyKTtcbiAgICAvLyByZXR1cm5cbiAgICByZXR1cm4gY2h1bms7XG4gIH1cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICAhQm9vbGVhbihcbiAgICAgICAgdGhpcy5pZCAmJlxuICAgICAgICAgIHRoaXMuc2l6ZSAmJlxuICAgICAgICAgIHRoaXMuYXVkaW9Gb3JtYXQgJiZcbiAgICAgICAgICB0aGlzLm51bUNoYW5uZWxzICYmXG4gICAgICAgICAgdGhpcy5zYW1wbGVSYXRlICYmXG4gICAgICAgICAgdGhpcy5ieXRlUmF0ZSAmJlxuICAgICAgICAgIHRoaXMuYmxvY2tBbGlnbiAmJlxuICAgICAgICAgIHRoaXMuYml0c1BlclNhbXBsZSxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2ZtdCBjaHVuayBpZCwgc2l6ZSwgYXVkaW9Gb3JtYXQsIG51bUNoYW5uZWxzLCBzYW1wbGVSYXRlLCBieXRlUmF0ZSwgYmxvY2tBbGlnbiBvciBiaXRzUGVyU2FtcGxlIGlzIG5vdCBjb250YWluZWQuIGludmFsaWQgZm9ybWF0LicsXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5pZCAhPSAnZm10ICcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZm10IGNodW5rIGZvcm1hdCBpcyBub3QgZm10LiBpbnZhbGlkIGZvcm1hdC4gaWQ6JHt0aGlzLmlkfWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaXplICE9IDE2KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGZtdCBjaHVuayBzaXplIGlzIG5vdCAxNi4gaW52YWxpZCBmb3JtYXQuIHNpemU6JHt0aGlzLnNpemV9YCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmF1ZGlvRm9ybWF0ICE9IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZm10IGNodW5rIGF1ZGlvRm9ybWF0IGlzIG5vdCAxLiBpbnZhbGlkIGZvcm1hdC4gYXVkaW9Gb3JtYXQ6JHt0aGlzLmF1ZGlvRm9ybWF0fWApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBkdW1wKG9mZnNldDogbnVtYmVyKTogYW55IHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCB0YWJsZXMgPSBbXTtcbiAgICB0YWJsZXMucHVzaCh7cG9zaXRpb246IG9mZnNldCwgbGVuZ3RoOiA0LCBoZWFkZXI6ICdTdWJjaHVuazEgSUQgXCJmbXQgXCInLCBkYXRhOiB0aGlzLmlkfSk7XG4gICAgdGFibGVzLnB1c2goe3Bvc2l0aW9uOiBvZmZzZXQgKyA0LCBsZW5ndGg6IDQsIGhlYWRlcjogJ1N1YmNodW5rMSBTaXplJywgZGF0YTogdGhpcy5zaXplfSk7XG4gICAgdGFibGVzLnB1c2goe3Bvc2l0aW9uOiBvZmZzZXQgKyA4LCBsZW5ndGg6IDIsIGhlYWRlcjogJ0F1ZGlvIEZvcm1hdCBcIjFcIiBQQ00nLCBkYXRhOiB0aGlzLmF1ZGlvRm9ybWF0fSk7XG4gICAgdGFibGVzLnB1c2goe3Bvc2l0aW9uOiBvZmZzZXQgKyAxMCwgbGVuZ3RoOiAyLCBoZWFkZXI6ICdOdW0gQ2hhbm5lbHMnLCBkYXRhOiB0aGlzLm51bUNoYW5uZWxzfSk7XG4gICAgdGFibGVzLnB1c2goe3Bvc2l0aW9uOiBvZmZzZXQgKyAxMiwgbGVuZ3RoOiA0LCBoZWFkZXI6ICdTYW1wbGUgUmF0ZScsIGRhdGE6IHRoaXMuc2FtcGxlUmF0ZX0pO1xuICAgIHRhYmxlcy5wdXNoKHtwb3NpdGlvbjogb2Zmc2V0ICsgMTYsIGxlbmd0aDogNCwgaGVhZGVyOiAnQnl0ZSBSYXRlJywgZGF0YTogdGhpcy5ieXRlUmF0ZX0pO1xuICAgIHRhYmxlcy5wdXNoKHtwb3NpdGlvbjogb2Zmc2V0ICsgMjAsIGxlbmd0aDogMiwgaGVhZGVyOiAnQmxvY2sgQWxpZ24nLCBkYXRhOiB0aGlzLmJsb2NrQWxpZ259KTtcbiAgICB0YWJsZXMucHVzaCh7cG9zaXRpb246IG9mZnNldCArIDIyLCBsZW5ndGg6IDIsIGhlYWRlcjogJ0JpdHMgUGVyIFNhbXBsZScsIGRhdGE6IHRoaXMuYml0c1BlclNhbXBsZX0pO1xuICAgIHJldHVybiB0YWJsZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBXYXZlIERhdGEgQ2h1bmtcbiAqL1xuY2xhc3MgV2F2RGF0YSBpbXBsZW1lbnRzIENodW5rIHtcbiAgY2h1bmtMZW5ndGg6IG51bWJlcjtcbiAgaWQ6IHN0cmluZyA9ICdkYXRhJztcbiAgc2l6ZTogbnVtYmVyO1xuICB3YXZCdWZmZXI6IEJ1ZmZlcjtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHN0YXRpYyBpc0NodW5rKGJ1ZmZlcjogQnVmZmVyKSB7XG4gICAgY29uc3QgaWQgPSBidWZmZXIucmVhZFVJbnRCRSgwLCA0KTtcbiAgICBjb25zdCBpZE5hbWUgPSBCdWZmZXIuZnJvbShpZC50b1N0cmluZygxNiksICdoZXgnKS50b1N0cmluZygpO1xuICAgIHJldHVybiBpZE5hbWUgPT0gJ2RhdGEnO1xuICB9XG4gIHN0YXRpYyBmcm9tKGJ1ZmZlcjogQnVmZmVyKSB7XG4gICAgY29uc3QgY2h1bmsgPSBuZXcgV2F2RGF0YSgpO1xuICAgIC8vIDEtNCBTdWJjaHVuazIgSUQgXCJkYXRhXCJcbiAgICBjaHVuay5pZCA9IEJ1ZmZlci5mcm9tKGJ1ZmZlci5yZWFkVUludEJFKDAsIDQpLnRvU3RyaW5nKDE2KSwgJ2hleCcpLnRvU3RyaW5nKCk7XG4gICAgLy8gNS04IFN1YmNodW5rMiBTaXplXG4gICAgY2h1bmsuc2l6ZSA9IGJ1ZmZlci5yZWFkVUludExFKDQsIDQpO1xuICAgIGNodW5rLmNodW5rTGVuZ3RoID0gY2h1bmsuc2l6ZSArIDg7XG4gICAgLy8gOS0gICBTdWJjaHVuazIgZGF0YVxuICAgIGNodW5rLndhdkJ1ZmZlciA9IGJ1ZmZlci5zbGljZSg4LCBjaHVuay5zaXplKTtcbiAgICAvLyByZXR1cm5cbiAgICByZXR1cm4gY2h1bms7XG4gIH1cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAvLyB2YWx1ZVxuICAgIGlmICghQm9vbGVhbih0aGlzLmlkICYmIHRoaXMuc2l6ZSAmJiB0aGlzLndhdkJ1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZGF0YSBjaHVuayBpZCwgc2l6ZSBvciBkYXRhIGlzIG5vdCBjb250YWluZWQuIGludmFsaWQgZm9ybWF0LicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5pZCAhPSAnZGF0YScpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZGF0YSBjaHVuayBpZCBpcyBub3QgZGF0YS4gaW52YWxpZCBmb3JtYXQuIGlkOiR7dGhpcy5pZH1gKTtcbiAgICB9XG4gICAgLy8gbGVuZ3RoXG4gICAgLy8gVE9ET1xuICAgIC8vaWYgKHRoaXMud2F2QnVmZmVyLmxlbmd0aCAhPSB0aGlzLnNpemUpIHtcbiAgICAvLyAgdGhyb3cgbmV3IEVycm9yKGBkYXRhIGNodW5rIGNodW5rTGVuZ3RoIGlzIG5vdCB2YWxpZCBsZW5ndGguIGludmFsaWQgZm9ybWF0LiBkZWNsYXJlZCBjaHVua0xlbmd0aDoke3RoaXMuY2h1bmtMZW5ndGh9LCBoZWFkZXIgc2l6ZTo4LCBidWZmZXIgbGVuZ3RoOiR7dGhpcy53YXZCdWZmZXIubGVuZ3RofWApO1xuICAgIC8vfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGR1bXAob2Zmc2V0OiBudW1iZXIpOiBhbnkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHRhYmxlcyA9IFtdO1xuICAgIHRhYmxlcy5wdXNoKHtwb3NpdGlvbjogb2Zmc2V0LCBsZW5ndGg6IDQsIGhlYWRlcjogJ1N1YmNodW5rMiBJRCBcImRhdGFcIicsIGRhdGE6IHRoaXMuaWR9KTtcbiAgICB0YWJsZXMucHVzaCh7cG9zaXRpb246IG9mZnNldCArIDQsIGxlbmd0aDogNCwgaGVhZGVyOiAnU3ViY2h1bmsyIFNpemUnLCBkYXRhOiB0aGlzLnNpemV9KTtcbiAgICB0YWJsZXMucHVzaCh7cG9zaXRpb246IG9mZnNldCArIDgsIGxlbmd0aDogdGhpcy5zaXplLCBoZWFkZXI6ICdXYXZlIERhdGEnLCBkYXRhOiAnKioqKioqJ30pO1xuICAgIHJldHVybiB0YWJsZXM7XG4gIH1cbn1cbiJdfQ==
