import * as Test from './test.ts'
import * as S from '../sha_1.ts'

const TEST_CASE =
[
    { v: 'abcde', a: '03de6c570bfe24bfc328ccd7ca46b76eadaf4334' },
    { v: '1234567890', a: '01b307acba4f54f55aafc33bb06bbbf6ca803e9a' },
    { v: '1234567890123456', a: 'deed2a88e73dccaa30a9e6e296f62be238be4ade' },
    { v: '12345678901234567890', a: '7e0a1242bd8ef9044f27dca45f5f72ad5a1125bf' },
    { v: '123456789012345678901234567890', a: 'cc84fa5a361f86a589169fde1e4e6d62bc786e6c' },
    { v: '12345678901234567890123456789012345678901234567890ABCDE', a: '874d095f94db29c0c6672b5c4690f618723baa5d' },
    { v: '12345678901234567890123456789012345678901234567890ABCDEF', a: '993ca78aa6d79c0e503b56d5f98831bc91abf687' },
    { v: '123456789012345678901234567890123456789012345678901234567890ABCD', a: 'addbb63b7cd9533f4ad432d3b15ea772a148925a' },
    { v: 'K8z8kLfDkvLd4B7Fj89035KAm1hBghba0GZJ34PiVlOJaCIZgX&PK0dyR37JwAFF3pAu2LKC7aitdDQ9FH8rM9FFxaLUo9Cd', a: 'e7851775c919024397873c22f0621566d152e06e' },
    { v: '123456789012345678901234567890123456789012345678901234567890ABCDGET&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fstatuses%2Fhome_timeline.json&oauth_consumer_key%3DOgz0dUNnbAa9em5T6fVOV0PQB%2', a: '0a4d771ecae240224b99258b32b5c79124ad8eb8' },
    { v: 'GET&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fstatuses%2Fhome_timeline.json&oauth_consumer_key%3DOgz0dUNnbAa9em5T6fVOV0PQB%26oauth_nonce%3D89ee6b57deee948202fab387d46e27bfab448288a87813ac9af330f6d8be92a7%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1607997803%26oauth_token%3D21752960-XNUmO4oWsR4GEahViHcFDVIRlRkfwayypJ7zdnCpj%26oauth_version%3D1.0', a: 'ba77c1b6d8062b2c22005c8c898678d45f0d5bb6' },
];

export const TestCase: Test.Case = () =>{
    return TEST_CASE.map( ( test ) =>
    {
        return () =>
        {
            const a = S.SHA_1( test.v ).toString();
            return Test.assertSame( a, test.a );
        };
    } );
};
