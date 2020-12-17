# drypto
TypeScript and WebAssembly(AssemblyScript) crypto library for Deno.

## Example

### import

```
import { drypto } from 'https://github.com/Azulamb/drypto/raw/main/mod.ts'
```

### Use Base64

```
import { Base64 } from 'https://github.com/Azulamb/drypto/raw/main/base64.ts'

const base64 = Base64.fromString( 'Hello, world!' );
const str = Base64.toString( base64 );
console.log( str, base64 );
```

### Use SHA-1

```
import { SHA_1 } from 'https://github.com/Azulamb/drypto/raw/main/sha_1.ts'

console.log( SHA_1( 'Hello, world!' ).toString() );
```

### Use HMAC (SHA-1)

```
import { HMAC } from 'https://github.com/Azulamb/drypto/raw/main/hmac.ts'
import { SHA_1, BLOCK_SIZE } from 'https://github.com/Azulamb/drypto/raw/main/sha_1.ts'

HMAC( key, message ).convert( SHA_1, BLOCK_SIZE ).data();
```

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



