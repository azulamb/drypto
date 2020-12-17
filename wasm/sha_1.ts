/*
Build:
    asc --runtime none -o sha_1.wasm sha_1.ts
*/

type byte = u8;
type word = u32;
type dword = u64;
type counter = u32;

export function SHA_1( size: counter ): counter
{
    const K0 = 0x5A827999;
    const K1 = 0x6ED9EBA1;
    const K2 = 0x8F1BBCDC;
    const K3 = 0xCA62C1D6;

    if ( size < 0 ) { size = 0; }

    store<byte>( size, 0x80 );

    const blocks: counter = blockCount( size );

    const last: counter = blocks * 64;

    // 0 fill
    for ( let i: counter = last - 8 ; size < i ; --i )
    {
        store<byte>( i, 0 );
    }

    // Write data size.
    const bits: dword = size * 8;
    store<byte>( last - 8, ( bits >> 56 ) & 0xFF );
    store<byte>( last - 7, ( bits >> 48 ) & 0xFF );
    store<byte>( last - 6, ( bits >> 40 ) & 0xFF );
    store<byte>( last - 5, ( bits >> 32 ) & 0xFF );
    store<byte>( last - 4, ( bits >> 24 ) & 0xFF );
    store<byte>( last - 3, ( bits >> 16 ) & 0xFF );
    store<byte>( last - 2, ( bits >> 8 ) & 0xFF );
    store<byte>( last - 1, bits & 0xFF );

    let h0: word = 0x67452301;
    let h1: word = 0xEFCDAB89;
    let h2: word = 0x98BADCFE;
    let h3: word = 0x10325476;
    let h4: word = 0xC3D2E1F0;

    const w: word[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    for ( let block: counter = 0 ; block < blocks ; ++block )
    {
        const offset = block * 64;
        for ( let t = 0 ; t < 16; ++t )
        {
            w[ t ]  = load<byte>( offset + t * 4 ) << 24;
            w[ t ] |= load<byte>( offset + t * 4 + 1 ) << 16;
            w[ t ] |= load<byte>( offset + t * 4 + 2 ) <<  8;
            w[ t ] |= load<byte>( offset + t * 4 + 3 );
        }
        for ( let t = 16 ; t < 80 ; ++t )
        {
            w[ t ] = SHA1CircularShift( 1, w[ t - 3 ] ^ w[ t - 8 ] ^ w[ t - 14 ] ^ w[ t - 16 ] );
        }

        let a = h0, b = h1, c = h2, d = h3, e = h4;

        for ( let t = 0 ; t < 20 ; ++t )
        {
            const tmp = SHA1CircularShift( 5, a ) + F00( b, c, d ) + e + w[ t ] + K0;
            e = d;
            d = c;
            c = SHA1CircularShift( 30, b );
            b = a;
            a = tmp;
        }
        for ( let t = 20 ; t < 40 ; ++t )
        {
            const tmp = SHA1CircularShift( 5, a ) + F20( b, c, d ) + e + w[ t ] + K1;
            e = d;
            d = c;
            c = SHA1CircularShift( 30, b );
            b = a;
            a = tmp;
        }
        for ( let t = 40 ; t < 60 ; ++t )
        {
            const tmp = SHA1CircularShift( 5, a ) + F40( b, c, d ) + e + w[ t ] + K2;
            e = d;
            d = c;
            c = SHA1CircularShift( 30, b );
            b = a;
            a = tmp;
        }
        for ( let t = 60 ; t < 80; t++ )
        {
            const tmp = SHA1CircularShift( 5, a ) + F60( b, c, d ) + e + w[ t ] + K3;
            e = d;
            d = c;
            c = SHA1CircularShift( 30, b );
            b = a;
            a = tmp;
        }

        h0 += a;
        h1 += b;
        h2 += c;
        h3 += d;
        h4 += e;
    }

    // Write result.
    outputWord( 0, h0 );
    outputWord( 4, h1 );
    outputWord( 8, h2 );
    outputWord( 12, h3 );
    outputWord( 16, h4 );
    store<byte>( 20, 0 );

    return blocks;
}

function blockCount( size: counter ): counter
{
    const blocks = size + 9;
    return <counter>( blocks / 64 ) + ( blocks % 64 ? 1 : 0 );
}

function outputWord( offset: counter, value: word ): void
{
    store<byte>( offset, value >> 24 );
    store<byte>( offset + 1, ( value >> 16 ) & 0xFF );
    store<byte>( offset + 2, ( value >> 8 ) & 0xFF );
    store<byte>( offset + 3, value & 0xFF );
}

function SHA1CircularShift( bits: counter, word: word ): word
{
    return ( ( ( word ) << ( bits ) ) | ( ( word ) >>> ( 32 - ( bits ) ) ) );
}

function F00( B: word, C: word, D: word ): word
{
    return ( B & C ) | ( ( ~B ) & D );
}

function F20( B: word, C: word, D: word ): word
{
    return B ^ C ^ D;
}

function F40( B: word, C: word, D: word ): word
{
    return ( B & C ) | ( B & D ) | ( C & D );
}

function F60( B: word, C: word, D: word ): word
{
    return B ^ C ^ D;
}
