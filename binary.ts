import { Base64 } from './base64.ts';

export class Binary {
	private d!: Uint8Array;

	constructor(data: Uint8Array) {
		this.d = data;
	}

	public data() {
		return this.d;
	}

	public toString(char = '0123456789abcdef') {
		return [...this.d].map((b) => {
			return char[(b >> 4) & 0xF] + char[b & 0xF];
		}).join('');
	}

	public toBase64() {
		return Base64.fromUint8Array(this.d);
	}
}

export interface BinaryFunc {
	(data: Uint8Array | string): Binary;
}
