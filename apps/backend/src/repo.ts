import { Knex } from 'knex';
import { AccessToken, Artifact, ArtifactId, ArtifactType, Course, CourseId, User, UserId } from '@tara/types';
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
		ato.userId = Number.parseInt(res[0][this.colnames.userId]);
		ato.value = res[0][this.colnames.value];
		return ato;
	}
}

export class CourseRepo extends AbstractRepo {
	colnames = COLNAMES.courses;
	tablename = TABLENAMES.courses;

	async create(name: string, ownerId: UserId): Promise<Course> {
		const course = new Course();
		const res = await this.client
			.returning(this.colnames.id)
			.insert({ [this.colnames.ownerId]: ownerId, [this.colnames.name]: name })
			.into(this.tablename);
		if (res.length === 0) return null;
		course.artifacts = [];
		course.id = Number.parseInt(res[0][this.colnames.id]);
		course.name = name;
		return course;
	}

	async get(id: CourseId): Promise<Course> {
		const course = new Course();
		const res = await this.client
			.select(this.colnames.id, this.colnames.name)
			.from(this.tablename)
			.where(this.colnames.id, '=', id)
		if (res.length === 0) return null;
		course.artifacts = [];
		course.id = res[0][this.colnames.id];
		course.name = res[0][this.colnames.name];
		return course;
	}

	async findByOwner(ownerId: UserId): Promise<Course[]> {
		const res = await this.client
			.select(this.colnames.id, this.colnames.name)
			.from(this.tablename)
			.where(this.colnames.ownerId, '=', ownerId)
		if (res.length === 0) return null;

		const courses = res.map((el) => {
			const course = new Course()
			course.artifacts = [];
			course.id = Number.parseInt(el[this.colnames.id]);
			course.name = el[this.colnames.name];
			return course
		})
		return courses;
	}

	async delete(id: CourseId): Promise<number> {
		const deleted = await this.client.where(this.colnames.id, id).delete()
		return deleted
	}
}

export class ArtifactRepo extends AbstractRepo {
	colnames = COLNAMES.artifacts;
	tablename = TABLENAMES.artifacts
	async create(type: ArtifactType, name: string, courseId: CourseId, parentArtifactId: ArtifactId, solution?: string): Promise<Artifact> {
		const art = new Artifact();
		const res = await this.client.returning(this.colnames.id).insert({
			[this.colnames.courseId]: courseId,
			[this.colnames.name]: name,
			[this.colnames.solution]: solution,
			[this.colnames.type]: type,
			[this.colnames.parentArtifactId]: parentArtifactId,
		}).into(this.tablename)
		if(res.length===0) return null;
		art.id = Number.parseInt(res[0][this.colnames.id]);
		art.courseId = courseId;
		art.name = name;
		art.type = type;
		art.parentId = parentArtifactId;
		return art;
	}

	async get(id: ArtifactId): Promise<Artifact> {
		const art = new Artifact();
		const res = await this.client.select(this.colnames.courseId, this.colnames.id, this.colnames.name, this.colnames.parentArtifactId, this.colnames.solution, this.colnames.type).from(this.tablename)
		if(res.length===0) return null;
		art.id = res[0][this.colnames.id];
		art.courseId = res[0][this.colnames.courseId];
		art.name = res[0][this.colnames.name];
		art.type = res[0][this.colnames.type]
		art.parentId = res[0][this.colnames.parentArtifactId]
		return art;
	}
}
