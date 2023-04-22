import { Knex } from 'knex';
import { User, UserId } from './models';
import { COLNAMES, TABLENAMES, generateAccessToken, hashPwd } from './utils';
import { ATFilterRequest, UserFilterRequest } from './daos';

abstract class AbstractRepo {
	constructor(protected readonly client: Knex) {}
}

export class UserRepo extends AbstractRepo {
	colnames = COLNAMES.users;
	async createUser(email: string, pwd: string): Promise<User> {
		const user = new User();
		const password = await hashPwd(pwd);
		const res = await this.client
			.insert({ email, password })
			.into(TABLENAMES.users);
		if (res.length === 0) return null;
		user.id = res[0];
		user.email = email;
		user.pwdhash = password;
		return user;
	}
	async findUser(filter: UserFilterRequest): Promise<User> {
		let q = this.client
			.select('id', 'email', 'pwdhash')
			.from<User>(TABLENAMES.users);
		if (filter.email) {
			q = q.where('email', filter.email);
		}
		if (filter.id) {
			q = q.where('id', filter.id);
		}
		const res = await q;
		if (res.length === 0) return null;
		const user = new User();
		user.id = res[0].id;
		user.email = res[0].email;
		user.pwdhash = res[0].pwdhash;
		return user;
	}
}

export class TokenRepo extends AbstractRepo {
	colnames = COLNAMES.accessTokens;
	async createAccessTokenForUser(userId: UserId): Promise<string> {
		const tok = generateAccessToken();
		await this.client
			.insert({ [this.colnames.token]: tok, [this.colnames.token]: userId })
			.into(TABLENAMES.accessTokens);
		return tok;
	}
	async findAccessToken(filter: ATFilterRequest): Promise<string> {
		let q = this.client
			.select(this.colnames.userId, this.colnames.token)
			.from(TABLENAMES.accessTokens);
		if (filter.token) {
			q = q.where(this.colnames.token, filter.token);
		}
		if (filter.userId) {
			q = q.where(this.colnames.userId, filter.userId);
		}
		const res = await q;
		if (res.length === 0) return null;
		return res[0][this.colnames.token];
	}
}


export class ArtifactRepo {

}