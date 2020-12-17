import * as path from "https://deno.land/std/path/mod.ts";

export function assertSame( a: any, b: any )
{
    if ( a === b ) { return Promise.resolve(); }
    return Promise.reject( new Error( 'Not same.' ) );
}

export interface Case { (): ( () => Promise<any> )[] }

if ( import.meta.main )
{
    const now = Date.now();

    console.log( 'Start tests ...' );

    const files = ( ( dir, file, list ) =>
    {
        const items = Deno.readDirSync( dir );
        const files: string[] = []
        for ( const item of items )
        {
            if ( item.isFile && item.name !== file )
            {
                files.push( item.name );
            }
        }

        if ( list.length <= 0 ) { return files; }

        return files.filter( ( file ) => { return 0 <= list.indexOf( file.replace( /\.ts$/, '' ) ); } );
    } )(
        path.fromFileUrl( path.dirname( import.meta.url ) ),
        path.basename( import.meta.url ),
        Deno.args.map( ( file ) =>
        {
            return file.replace( /\.ts$/, '' );
        } )
    );

    const all: { file: string, get: () => ( () => Promise<any> )[] }[] = [];
    Promise.allSettled( files.map( ( file ) =>
    {
        return import( `./${ file }` ).then( ( mod ) =>
        {
            if ( typeof mod.TestCase !== 'function' ) { throw new Error( 'Not found.' ); }
            all.push( { file: file, get: mod.TestCase } );
        } ).catch( () =>
        {
            console.log( `${ file }: Not found TestCase(): ( () => Promise<any> )[];` );
        } );
    } ) ).then( async () =>
    {
        all.sort( ( a, b ) => { return a.file < b.file ? -1 : 1; } );

        const errors: { file: string, no: number, error: any }[] = [];
        const exec = async ( test: () => Promise<any> ) => { await test(); };

        const width = 80;

        for ( let info of all )
        {
            const tests = info.get();

            console.log( '--------' );
            if ( !Array.isArray( tests ) )
            {
                console.log( 'No tests: ${ info.file }' );
                continue;
            }

            console.log( `Start: ${ info.file }` );

            const result = { total: 0, success: 0, failure: 0 };
            for ( let i = 0 ; i < tests.length ; ++i )
            {
                if ( typeof tests[ i ] !== 'function' ) { continue; }

                await exec( tests[ i ] ).then( () =>
                {
                    Deno.stdout.writeSync( Uint8Array.from( [ 0x53 ] ) );
                    ++result.success;
                } ).catch( ( error ) =>
                {
                    Deno.stdout.writeSync( Uint8Array.from( [ 0x46 ] ) );
                    errors.push(
                    {
                        file: info.file,
                        no: i,
                        error: error,
                    } );
                    ++result.failure;
                } ).finally( () => { ++result.total; } );
                if ( i % width === width - 1 ) { console.log(); }
            }

            if ( tests.length % width ) { console.log(); }
            console.log( `Total: ${ result.total } Success: ${ result.success } Failure: ${ result.failure }` );
        }

        if ( 0 < errors.length ) { throw errors; }
    } ).then( () =>
    {
        console.log( 'Complete!' );
    } ).catch( ( error ) =>
    {
        if ( !Array.isArray( error ) )
        {
            console.log( error );
        } else
        {
            error.forEach( ( error: { file: string, no: number, error: any } ) =>
            {
                console.log( `${ error.file }: No( ${ error.no } )` );
                console.log( error.error );
            } );
        }

        Deno.exit( 1 );
    } );
}
