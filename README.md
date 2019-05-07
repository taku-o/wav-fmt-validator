# wav-fmt-validator

## description
wav audio file format validator library for unit test.

## install

```sh
npm install --save wav-fmt-validator
```

## validator library
### validate wav audio file format example on unit test.

```js
var assert = require('assert');
var fs = require('fs');
var wavValidator = require('wav-fmt-validator').validator;

var wavPath = ...

fs().readFile(wavPath, 'binary', (err, content) => {
  assert.ok(!err);
  var wavBuffer = Buffer.from(content, 'binary');
  assert.ok(wavValidator(wavBuffer));
});
```

### get wav audio file information.

```js
var fs = require('fs');
var wavParser = require('wav-fmt-validator').parser;

var wavPath = ...

fs().readFile(wavPath, 'binary', (err, content) => {
  if (err) {
    return;
  }
  var wavBuffer = Buffer.from(content, 'binary');
  console.log(wavParser(wavBuffer));
});
```

## command
### wav-parse command.
simply command to parse, and display wav file information.

```sh
wav-parse wav-file.wav
```

this command will display wav info.

```
position  length  header                data  
--------  ------  --------------------  ------
0         4       Chunk ID "RIFF"       RIFF  
4         4       Chunk Size            239982
8         4       Format "WAVE"         WAVE  
12        4       Subchunk1 ID "fmt "   fmt   
16        4       Subchunk1 Size        16    
20        2       Audio Format "1" PCM  1     
22        2       Num Channels          1     
24        4       Sample Rate           44100 
28        4       Byte Rate             88200 
32        2       Block Align           2     
34        2       Bits Per Sample       16    
36        4       Subchunk2 ID "data"   data  
40        4       Subchunk2 Size        239946
44        239946  Wave Data             ******
```

