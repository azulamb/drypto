#!/bin/sh

cd `dirname $0`
cd wasm

# SHA-1
#asc --runtime none --importMemory -o sha_1.wasm sha_1.ts
#asc --runtime none --importMemory -o sha_1.wat sha_1.ts
asc --runtime none -o sha_1.wasm sha_1.ts
asc --runtime none -o sha_1.wat sha_1.ts
