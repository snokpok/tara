import express from 'express';
import knex from 'knex';
import { ArtifactRepo, CourseRepo, TokenRepo, UserRepo } from './repo';
import {} from '@tara/api-client-ts';
import { extractTokenFromAuthHeader, pwdSame } from './utils';
import { AIRepository } from './ai';
import morgan from 'morgan';
import { Middlewares } from './mws';
import { config } from 'dotenv';
import cors from 'cors';
import { Artifact, ArtifactId } from '@tara/types';
import cookieParser from 'cookie-parser'

config();

const client = knex({
	client: 'pg',
	connection: process.env.DATABASE_URL || '',
});

const userRepo = new UserRepo(client);
const tokenRepo = new TokenRepo(client);
const courseRepo = new CourseRepo(client);
const artRepo = new ArtifactRepo(client);
const aiRepo = new AIRepository();

const mws = new Middlewares(tokenRepo);

const app = express();

app.use(cors({credentials: true, origin: 'http://127.0.0.1:4200'}));
app.use(cookieParser());

app.use(express.json());
app.use(morgan('combined'));

app.get('/metrics', (req, res) => {
	return res.send('OK');
});


app.post('/auth/register', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if ((await userRepo.findUser({ email })) !== null) {
			return res.status(400).json({ error: 'User already exists' });
		}
		const user = await userRepo.createUser(email, password);
		const accessToken = await tokenRepo.createAccessTokenForUser(user.id);
		return res.json({ token: accessToken });
	} catch (e) {
		next(e);
	}
});

app.post('/auth/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await userRepo.findUser({ email });
		if (user === null) {
			return res.status(400).json({ error: 'User not found' });
		}
		if (await pwdSame(user.pwdhash, password)) {
			const accessToken = await tokenRepo.findAccessToken({ userId: user.id });
			if (accessToken === null) {
				accessToken.value = await tokenRepo.createAccessTokenForUser(user.id);
				accessToken.userId = user.id;
			}
			res.cookie("token", accessToken.value, {secure: true, httpOnly: true})
			return res.send({
				accessToken: accessToken.value,
				userId: accessToken.userId,
			});
		}
		return res.status(401).json({ error: 'Wrong password' });
	} catch (e) {
		next(e);
	}
});

app.post('/chat', async (req, res) => {
	const question = req.body.question;
	const courseId = req.query.courseId as string;
	if (!question || !courseId) {
		return res.status(400).json({ message: 'Must provide question or courseId in query string' });
	}
	const cnid =Number.parseInt(courseId);
	if(isNaN(cnid)) {
		return res.status(400).json({ message: 'Incorrect number course ID' });
	}
	const foundCourse = await courseRepo.get(cnid);
	if(!foundCourse) {
		return res.status(400).json({ message: 'Course not found' });
	}
	try {
		const artifacts = await artRepo.find({courseId: cnid});
		foundCourse.artifacts = createArtifactTree(artifacts);
		const ans = await aiRepo.answerQuestion(question as string, foundCourse);
		return res.json({ data: ans });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: e });
	}
});

app.post('/courses', mws.authorizedFactory(), async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ error: 'Must provide name' });
		}
		const { userId } = await tokenRepo.findAccessToken({
			token: extractTokenFromAuthHeader(req.headers.authorization),
		});
		const course = await courseRepo.create(name, userId);
		return res.json({ id: course.id });
	} catch (e) {
		next(e);
	}
});

app.get('/courses', mws.authorizedFactory(), async (req, res, next) => {
	try {
		const { userId } = await tokenRepo.findAccessToken({
			token: extractTokenFromAuthHeader(req.headers.authorization),
		});
		const courses = await courseRepo.findByOwner(userId);
		return res.json({ data: courses });
	} catch (e) {
		next(e);
	}
});

export const createArtifactTree = (artifacts: Artifact[]): Artifact[] => {
	const map: Record<ArtifactId, Artifact> = {};
	const adjList: Record<ArtifactId, ArtifactId[]> = {};
	artifacts.forEach((el) => {
		map[el.id] = el;
		adjList[el.id] = [];
	});

	artifacts.forEach((art) => {
		if (adjList[art.parentId]) {
			adjList[art.parentId].push(art.id);
		}
	});

	const tree: Artifact[] = [];

	artifacts.forEach((art) => {
		if (art.parentId === null) {
			// start from root
			tree.push(helper(art.id, adjList, map));
		}
	});
	return tree;
};

const helper = (
	rootId: ArtifactId,
	adjList: Record<ArtifactId, ArtifactId[]>,
	artifactMap: Record<ArtifactId, Artifact>
): Artifact => {
	const neighborArtifacts: Artifact[] = [];
	const artifact = artifactMap[rootId];
	if (adjList[rootId].length === 0) return artifact;
	for (const neighborId of adjList[rootId]) {
		neighborArtifacts.push(helper(neighborId, adjList, artifactMap));
	}
	artifactMap[rootId].children = neighborArtifacts;
	return artifactMap[rootId];
};

app.get('/courses/:id', mws.authorizedFactory(), async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ error: 'Must provide course ID' });
		}
		const numid = Number.parseInt(id);
		if (isNaN(numid)) {
			return res
				.status(400)
				.json({ error: 'Invalid course ID; must be an integer' });
		}
		const course = await courseRepo.get(numid);
		const artifacts = await artRepo.find({ courseId: course.id });
		course.artifacts = createArtifactTree(artifacts);
		return res.json({ data: course });
	} catch (e) {
		next(e);
	}
});

app.post('/courses/:id/artifacts', mws.authorizedFactory(), async (req, res, next) => {
	try {
		const courseId = req.params.id;
		if (!courseId) {
			return res.status(400).json({ error: 'Must provide course ID' });
		}
		const courseNumId = Number.parseInt(courseId);
		const course = courseRepo.get(courseNumId);
		if (course === null) {
			return res.status(404).json({ error: 'Course not found' });
		}
		if (isNaN(courseNumId)) {
			return res
				.status(400)
				.json({ error: 'Invalid course ID; must be an integer' });
		}
		const { type, name, solution, parentArtifactId } = req.body;
		if (!type || !name) {
			return res.status(400).json({ error: 'Must provide type and name' });
		}
		// TODO: verify correct type

		if (parentArtifactId) {
			const parent = await artRepo.find({
				id: Number.parseInt(parentArtifactId),
			});
			if (parent.length === 0) {
				return res.status(404).json({ error: 'Parent not found' });
			}
		}
		const { id } = await artRepo.create(
			type,
			name,
			courseNumId,
			parentArtifactId,
			solution
		);
		return res.json({ id });
	} catch (e) {
		next(e);
	}
});

app.put('/courses/:id/artifacts/:artifactId', mws.authorizedFactory(), async (req, res, next) => {
	try {
		const courseId = req.params.id;
		if (!courseId) {
			return res.status(400).json({ error: 'Must provide course ID' });
		}
		const courseNumId = Number.parseInt(courseId);
		if (isNaN(courseNumId)) {
			return res
				.status(400)
				.json({ error: 'Invalid course ID; must be an integer' });
		}
		const course = await courseRepo.get(courseNumId);
		if (course === null) {
			return res.status(404).json({ error: 'Course not found' });
		}

		const {artifactId} = req.params;
		if (!artifactId) {
			return res.status(400).json({ error: 'Must provide artifact ID' });
		}
		const artNumId = Number.parseInt(artifactId);
		if (isNaN(artNumId)) {
			return res
				.status(400)
				.json({ error: 'Invalid artifact ID; must be an integer' });
		}
		const art = await artRepo.find({id: artNumId});
		if (art === null) {
			return res.status(404).json({ error: 'Artifact not found' });
		}
		const {name, solution} = req.body;
		await artRepo.edit(courseNumId, 
			{name,
			solution}
		);
		return res.json({ id: artNumId });
	} catch (e) {
		next(e);
	}
});


app.use((err, req, res, next) => {
	console.error(err);
	return res.status(500).json({ error: err });
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('inspector').close()
const port = process.env.PORT || 3333;
app.listen(port, async () => {
	console.log(`Listening at http://localhost:${port}`);
});
