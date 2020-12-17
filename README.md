# drypto
TypeScript and WebAssembly(AssemblyScript) crypto library for Deno.

## Example

### import

```
import { drypto } from 'https://github.com/Azulamb/drypto/raw/main/mod.ts'
```

### Use Base64

### Use SHA-1

### Use HMAC (SHA-1)

## Exec

#### Exec Base64 encode

```
deno run base64.ts Hello,World!
```

### Exec SHA-1 encode

```
deno run sha_1.ts Hello,World!
```

## Build wasm

Need AssemblyScript.

```
./build.sh
```

## Test

```
./test.sh
```

or

```
./test.ts TEST_FILE_NAMES
```

`TEST_FILE_NAMES` is for example `sha_1`, `hmac`, etc...



