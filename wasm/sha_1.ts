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

    if ( size < 0 ) size = 0;

    store<byte>( size, 0x80 );

    const blocks: counter = blockCount( size );

    const last: counter = blocks * 64;
    memory.fill(last - 8, 0, size);

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

    const w = memory.data<word>([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    for ( let block: counter = 0 ; block < blocks ; ++block )
    {
        const offset = block * 64;
        memory.copy(w, offset, 16 * 4);

        for ( let t = 16 ; t < 80 ; ++t )
        {
            let offset = w + (t << 2);
            store<word>(offset, rotl(
                load<word>(offset -  3) ^
                load<word>(offset -  8) ^
                load<word>(offset - 14) ^
                load<word>(offset - 16), 1
            ));
        }

        let a = h0, b = h1, c = h2, d = h3, e = h4;

        for ( let t = 0 ; t < 20 ; ++t )
        {
            const tmp = rotl(a, 5) + F00( b, c, d ) + e + load<word>(w + (t << 2)) + K0;
            e = d;
            d = c;
            c = rotl(b, 30);
            b = a;
            a = tmp;
        }

        for ( let t = 20 ; t < 40 ; ++t )
        {
            const tmp = rotl(a, 5) + F20( b, c, d ) + e + load<word>(w + (t << 2)) + K1;
            e = d;
            d = c;
            c = rotl(b, 30);
            b = a;
            a = tmp;
        }

        for ( let t = 40 ; t < 60 ; ++t )
        {
            const tmp = rotl(a, 5) + F40( b, c, d ) + e + load<word>(w + (t << 2)) + K2;
            e = d;
            d = c;
            c = rotl(b, 30);
            b = a;
            a = tmp;
        }

        for ( let t = 60 ; t < 80; t++ )
        {
            const tmp = rotl(a, 5) + F60( b, c, d ) + e + load<word>(w + (t << 2)) + K3;
            e = d;
            d = c;
            c = rotl(b, 30);
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

@inline
function blockCount( size: counter ): counter
{
    const blocks = size + 9;
    return (blocks >> 6) + <counter>(blocks & 63);
}

@inline
function outputWord( offset: counter, value: word ): void
{
    store<word>(offset, bswap(value));
}

@inline
function F00( B: word, C: word, D: word ): word
{
    return ( B & C ) | ( ( ~B ) & D );
}

@inline
function F20( B: word, C: word, D: word ): word
{
    return B ^ C ^ D;
}

@inline
function F40( B: word, C: word, D: word ): word
{
    return ( B & C ) | ( B & D ) | ( C & D );
}

@inline
function F60( B: word, C: word, D: word ): word
{
    return B ^ C ^ D;
}
