import { Base64 } from './base64.ts'
import * as SHA_1 from './sha_1.ts'
import { HMAC } from './hmac.ts'

export const VERSION = '0.0.1';
export const VERSION_CODE = 1;

export const drypto =
{
    // Convert.
    base64: Base64,

    // Hash.
    sha_1: SHA_1.SHA_1,

    hmac: HMAC,

    // Crypto

    // Block size.
    blockSize:
    {
        sha_1: SHA_1.BLOCK_SIZE,
    },

    // HashSize
    hashSize:
    {
        sha_1: SHA_1.HASH_SIZE,
    },
};
