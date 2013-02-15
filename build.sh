#!/bin/sh

echo 'Translating TypeScript to JavaScript...'
tsc --out bin/jsen.js src/jsen.ts
tsc --out bin/ecma262.js src/ecma262.ts

echo 'Minifying...'
java -jar lib/yuicompressor.jar -o bin/jsen.min.js bin/jsen.js
#java -jar lib/yuicompressor.jar -o bin/ecma262.min.js bin/ecma262.js

echo 'Complete.'
