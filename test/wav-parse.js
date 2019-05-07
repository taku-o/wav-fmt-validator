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
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QztJQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQzNELE1BQU0sT0FBTyxHQUFHLHdCQUF3QixDQUFDO1FBQ3pDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUM5QyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNoQjtZQUNELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLElBQUk7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyxhQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2xCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsYUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQjtZQUNELEVBQUUsRUFBRSxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3Qvd2F2LXBhcnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciB3YXZQYXJzZXIgPSByZXF1aXJlKCcuLi92YWxpZGF0b3InKS5wYXJzZXI7XG52YXIgd2F2VmFsaWRhdG9yID0gcmVxdWlyZSgnLi4vdmFsaWRhdG9yJykudmFsaWRhdG9yO1xuXG5yZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKCk7XG5cbi8vIHBhcnNlclxuZGVzY3JpYmUoJ3BhcnNlcicsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gcGFyc2VkIGF1ZGlvIGRhdGEuJywgKGNiKSA9PiB7XG4gICAgY29uc3Qgd2F2RmlsZSA9ICcuL3Rlc3Qvc2FtcGxlLXdhdi53YXYnO1xuICAgIGZzLnJlYWRGaWxlKHdhdkZpbGUsICdiaW5hcnknLCAoZXJyLCBjb250ZW50KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfVxuICAgICAgbGV0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGNvbnRlbnQsICdiaW5hcnknKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHdhdlBhcnNlcihidWZmZXIpO1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgIGFzc2VydC5vayhyZXN1bHQpO1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0aHJvdyBlcnJvciB0byBwYXJzZSBpbnZhbGlkIGF1ZGlvIGRhdGEuJywgKGNiKSA9PiB7XG4gICAgY29uc3Qgd2F2RmlsZSA9ICcuL3Rlc3QvaW52YWxpZC13YXYud2F2JztcbiAgICBmcy5yZWFkRmlsZSh3YXZGaWxlLCAnYmluYXJ5JywgKGVyciwgY29udGVudCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGxldCBidWZmZXIgPSBCdWZmZXIuZnJvbShjb250ZW50LCAnYmluYXJ5Jyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB3YXZQYXJzZXIoYnVmZmVyKTtcbiAgICAgICAgYXNzZXJ0Lm9rKGZhbHNlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgYXNzZXJ0Lm9rKHRydWUpO1xuICAgICAgfVxuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLy8gdmFsaWRhdG9yXG5kZXNjcmliZSgndmFsaWRhdG9yJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHZhbGlkYXRlIHdhdiBhdWRpbyBmaWxlLicsIChjYikgPT4ge1xuICAgIGNvbnN0IHdhdkZpbGUgPSAnLi90ZXN0L3NhbXBsZS13YXYud2F2JztcbiAgICBmcy5yZWFkRmlsZSh3YXZGaWxlLCAnYmluYXJ5JywgKGVyciwgY29udGVudCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGxldCBidWZmZXIgPSBCdWZmZXIuZnJvbShjb250ZW50LCAnYmluYXJ5Jyk7XG4gICAgICBjb25zdCByZXN1bHQgPSB3YXZWYWxpZGF0b3IoYnVmZmVyKTtcbiAgICAgIGFzc2VydC5vayhyZXN1bHQpO1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0aHJvdyBlcnJvciB0byBwYXJzZSBpbnZhbGlkIGF1ZGlvIGRhdGEuJywgKGNiKSA9PiB7XG4gICAgY29uc3Qgd2F2RmlsZSA9ICcuL3Rlc3QvaW52YWxpZC13YXYud2F2JztcbiAgICBmcy5yZWFkRmlsZSh3YXZGaWxlLCAnYmluYXJ5JywgKGVyciwgY29udGVudCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGxldCBidWZmZXIgPSBCdWZmZXIuZnJvbShjb250ZW50LCAnYmluYXJ5Jyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB3YXZWYWxpZGF0b3IoYnVmZmVyKTtcbiAgICAgICAgYXNzZXJ0Lm9rKGZhbHNlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgYXNzZXJ0Lm9rKHRydWUpO1xuICAgICAgfVxuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
