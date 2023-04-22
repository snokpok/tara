import { Knex } from 'knex';
import { AccessToken, User, UserId } from './models';
import { COLNAMES, TABLENAMES, generateAccessToken, hashPwd } from './utils';
import { ATFilterRequest, UserFilterRequest } from './daos';

abstract class AbstractRepo {
	constructor(protected readonly client: Knex) {}
}

export class UserRepo extends AbstractRepo {
	colnames = COLNAMES.users;
	async createUser(email: string, pwd: string): Promise<User> {
		const user = new User();
		const pwdhash = await hashPwd(pwd);
		const res = await this.client
			.insert({ email, pwdhash })
			.into(TABLENAMES.users);
		if (res.length === 0) return null;
		user.id = res[0];
		user.email = email;
		user.pwdhash = pwdhash;
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
			.insert({ [this.colnames.value]: tok, [this.colnames.userId]: userId })
			.into(TABLENAMES.accessTokens);
		return tok;
	}
	async findAccessToken(filter: ATFilterRequest): Promise<AccessToken> {
		let q = this.client
			.select(this.colnames.userId, this.colnames.value)
			.from(TABLENAMES.accessTokens);
		if (filter.token) {
			q = q.where(this.colnames.value, filter.token);
		}
		if (filter.userId) {
			q = q.where(this.colnames.userId, filter.userId);
		}
		const res = await q;
		if (res.length === 0) return null;
		const ato = new AccessToken();
		ato.userId = res[0][this.colnames.userId];
		ato.value = res[0][this.colnames.value];
		return ato
	}
}


export class ArtifactRepo extends AbstractRepo{
	
}