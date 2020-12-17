#!/bin/sh

cd `dirname $0`
cd wasm

# SHA-1
asc --runtime none -O3 --noAssert -o sha_1.wasm -t sha_1.wat sha_1.ts
