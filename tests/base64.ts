import * as Test from './test.ts';
import { Base64 } from '../base64.ts';

const TEST_CASE = [
	{ str: '123456', base64: 'MTIzNDU2' },
	{ str: '1234567890ABCD', base64: 'MTIzNDU2Nzg5MEFCQ0Q=' },
	{ str: '1234567890ABCDEF', base64: 'MTIzNDU2Nzg5MEFCQ0RFRg==' },
];

export const TestCase: Test.Case = () => {
	return TEST_CASE.map((test) => {
		return async () => {
			await Test.assertSame(Base64.fromString(test.str), test.base64);
			await Test.assertSame(test.str, Base64.toString(test.base64));
		};
	});
};
