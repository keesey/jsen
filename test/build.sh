#!/bin/sh

cd ..

./build.sh

cd test

echo 'Translating TypeScript to JavaScript...'
tsc --out bin/jsen.js src/jsen.ts
tsc --out bin/ecma262.js src/ecma262.ts

echo 'Complete.'
