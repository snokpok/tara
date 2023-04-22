import { randomUUID } from 'crypto';
import {compare, hash} from 'bcrypt'

export const TABLENAMES = {
	users: 'users',
	accessTokens: 'access_tokens',
	artifacts: "artifacts", 
	artifactTrees: "artifact_trees"
};

export const COLNAMES = {
	users: {
		id: "id",
		email: "email",
		pwdhash: "pwdhash"
	},
	accessTokens: {
		value: 'value',
		userId: 'user_id',
	},
	artifacts: {
		id: "id",
		type: "type",
		name: "name",
		solution: "solution",
	},
	artifactTrees: {
		id: "id",
		parentId: "parent_id", 
		childId: "child_id",
	}
}

export const generateAccessToken = () => {
	return randomUUID();
};

export const hashPwd = async (pwd: string): Promise<string> => {
	const hashed =await hash(pwd, 10);
	return hashed;
};

export const pwdSame = async (h: string, p: string): Promise<boolean> => {
	return await compare(p,h);
};
