import { randomUUID } from 'crypto';
import {hash} from 'bcrypt'

export const TABLENAMES = {
	users: 'users',
	accessTokens: 'access_tokens',
};

export const COLNAMES = {
	users: {
		id: "id",
		email: "email",
		pwdhash: "pwdhash"
	},
	accessTokens: {
		token: 'value',
		userId: 'user_id',
	}
}

export const generateAccessToken = () => {
	return randomUUID();
};

export const hashPwd = async (pwd: string): Promise<string> => {
	// TODO: do hashing
	const hashed =await hash(pwd, 10);
	return hashed;
};

export const pwdSame = async (h: string, p: string): Promise<boolean> => {
	return await hashPwd(p) === h;
};
