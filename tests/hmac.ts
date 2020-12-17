import * as Test from './test.ts'
import { HMAC } from '../hmac.ts'
import { SHA_1, BLOCK_SIZE as SHA_1_BLOCK_SIZE } from '../sha_1.ts'

const TEST_CASE =
[
    { k: '12345678901234567890', m: 'abcde', a: '0e1d40481947d193317c2e77f70ece2dd4757311' },
    { k: '123456789012345678901234567890123456789012345678901234567890ABCD', m: 'abcde', a: 'f55045ffdaeb6f4e59a2d57f07c6b32b875181e1' },
    { k: '123456789012345678901234567890123456789012345678901234567890ABCDE', m: 'abcde', a: '06a5f08b7eac182b8ad51265364845d7fba94032' },
    { k: '123456789012345678901234567890123456789012345678901234567890ABCD123456789012345678901234567890123456789012345678901234567890ABCD', m: 'abcde', a: '7b49c759ff0bd2ba42d4ffedb64d5983d11e9fb2' },
    { k: '123456789012345678901234567890123456789012345678901234567890ABCD123456789012345678901234567890123456789012345678901234567890ABCD', m: '123456789012345678901234567890123456789012345678901234567890abcde', a: '76441726ee5ba776152587e668ebe6c0c9c64859' },
    { k: 'K8z8kLfDkvLd4B7Fj89035KAm1hBghba0GZJ34PiVlOJaCIZgX&PK0dyR37JwAFF3pAu2LKC7aitdDQ9FH8rM9FFxaLUo9Cd', m: 'GET&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fstatuses%2Fhome_timeline.json&oauth_consumer_key%3DOgz0dUNnbAa9em5T6fVOV0PQB%26oauth_nonce%3D89ee6b57deee948202fab387d46e27bfab448288a87813ac9af330f6d8be92a7%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1607997803%26oauth_token%3D21752960-XNUmO4oWsR4GEahViHcFDVIRlRkfwayypJ7zdnCpj%26oauth_version%3D1.0', a: 'ceff7849d66fdc7cb1fc30523de3f4fb6ea2080b' },
];

export const TestCase: Test.Case = () =>{
    return TEST_CASE.map( ( test ) =>
    {
        return () =>
        {
            const a = HMAC( test.k, test.m ).convert( SHA_1, SHA_1_BLOCK_SIZE ).toString();
            return Test.assertSame( a, test.a );
        };
    } );
};
