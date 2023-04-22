import { randomUUID } from 'crypto';

export const TABLENAMES = {
	users: 'users',
	accessTokens: 'access_tokens',
};

export const generateAccessToken = () => {
	return randomUUID();
};

export const hashPwd = (pwd: string) => {
	// TODO: do hashing
	return pwd;
};

export const pwdSame = (h: string, p: string) => {
	return hashPwd(p) === h;
};
