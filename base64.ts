const DEFAULT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_EMPTY = '=';

export class Base64
{
    static toString(
        base64: string,
        table: string = DEFAULT_TABLE,
        empty: string = DEFAULT_EMPTY
    )
    {
        return new TextDecoder().decode( this.toUint8Array( base64, table, empty ) );
    }

    static toUint8Array(
        base64: string,
        table: string = DEFAULT_TABLE,
        empty: string = DEFAULT_EMPTY
    )
    {
        const str = base64.replace( new RegExp( empty, 'g' ), '' );
        if ( str.match( new RegExp( `/[^${ table.replace( /[^0-9a-zA-Z]/g, '\\$1' ) }]/` ) ) ) { throw new Error( 'Invalid value. Exists illegal characters.' ); }
        const chars = [ ... str ];
        //if ( chars.length % 4 ) { throw new Error( 'Invalid value. Not Base64 string.' ); }

        const data = new Uint8Array( ( ( chars.length + ( chars.length % 4 ? 4 : 0 ) ) >> 2 ) * 3 );

        const converter = ( char: string ) =>
        {
            const index = table.indexOf( char );
            return index < 0 ? 0 : index;
        };
        let w = 0;
        for ( let i = 0 ; i < chars.length; i += 4 )
        {
            const [ a, b, c, d ] =
            [
                converter( chars[ i ] ),
                converter( chars[ i + 1 ] ),
                converter( chars[ i + 2 ] ),
                converter( chars[ i + 3 ] ),
            ];

            // a[OOOOOO]b[OO----]
            if ( w < data.length ) { data[ w++ ] = ( a << 2 ) | ( b >> 4 ); }
            // b[--OOOO]c[OOOO--]
            if ( w < data.length && i + 2 < chars.length ) { data[ w++ ] = ( ( b & 0xF ) << 4 ) | ( c >> 2 ); }
            // c[----OO]d[OOOOOO]
            if ( w < data.length && i + 3 < chars.length ) { data[ w++ ] = ( ( c & 0x3 ) << 6 ) | d ; }
        }

        if ( w === data.length ) { return data; }

        const newData = new Uint8Array( w );
        newData.set( data.slice( 0, w ) );

        return newData;
    }

    static fromString(
        data: string,
        table: string = DEFAULT_TABLE,
        empty: string = DEFAULT_EMPTY
    )
    {
        return this.fromUint8Array( ( new TextEncoder() ).encode( data ), table, empty );
    }

    static fromUint8Array(
        buffer: Uint8Array,
        table: string = DEFAULT_TABLE,
        empty: string = DEFAULT_EMPTY
    )
    {
        const base64: string[] = [];

        for ( let i = 0 ; i < buffer.length ; i += 3 )
        {
            const [ a , b, c ] = [ buffer[ i ], buffer[ i + 1 ] || 0, buffer[ i + 2 ] || 0 ];
            // a[OOOOOO--]
            base64.push( table[ a >> 2 ] );
            // a[------OO]b[OOOO----]
            base64.push( table[ ( ( a & 0x3 ) << 4 ) | ( b >> 4 ) ] );
            // b[----OOOO]c[OO------]
            base64.push( i + 1 < buffer.length ? table[ ( b & 0xF ) << 2 | ( c >> 6 ) ] : empty );
            // c[--OOOOOO]
            base64.push( i + 2 < buffer.length ? table[ c & 0x3F ] : empty );
        }

        return base64.join( '' );
    }    
}

if ( import.meta.main )
{
    Deno.args.forEach( ( data ) =>
    {
        console.log( Base64.fromString( data ).toString() );
    } );
}
