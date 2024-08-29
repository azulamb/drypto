import { Binary, BinaryFunc } from './binary.ts';

export const SHA_256: BinaryFunc = (data: Uint8Array | string) => {

	return new Binary(buf.slice(0, HASH_SIZE));
};

if (import.meta.main) {
	Deno.args.forEach((data) => {
		console.log(SHA_256(data).toString());
	});
}
