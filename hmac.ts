import { BinaryFunc } from "./binary.ts";

export function HMAC( key: Uint8Array | string, message: Uint8Array | string )
{
    return new Hmac(
        typeof key === 'string' ? ( new TextEncoder() ).encode( key ) : key,
        typeof message === 'string' ? ( new TextEncoder() ).encode( message ) : message
    );
}

class Hmac
{
    private key!: Uint8Array;
    private message!: Uint8Array;

    constructor( key: Uint8Array, message: Uint8Array )
    {
        this.key = key;
        this.message = message;
    }

    public convert( hash: BinaryFunc, size: number )
    {
        const key = createKey( this.key, size, hash );

        const ipad = 0x36;
        const opad = 0x5C;

        return hash(
            merge(
                xor( key, opad ),
                hash(
                    merge(
                        xor( key, ipad ),
                        this.message
                    )
                ).data()
            )
        );
    }
}

function createKey( data: Uint8Array, size: number, hash: BinaryFunc )
{
    if ( data.length === size ) { return data; }

    const buffer = new Uint8Array( size );

    buffer.set( size < data.length ? hash( data ).data() : data );

    return buffer;
}

function xor( data: Uint8Array, op: number )
{
    return new Uint8Array( data.length ).map( ( v, i ) =>
    {
        return ( op ^ ( data[ i ] ) ) & 0xFF;
    } );
}

function merge( a: Uint8Array, b: Uint8Array )
{
    const data = new Uint8Array( a.length + b.length );

    data.set( a );
    data.set( b, a.length );

    return data;
}
