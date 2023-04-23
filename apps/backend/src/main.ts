import express from 'express';
import knex from 'knex';
import { ArtifactRepo, CourseRepo, TokenRepo, UserRepo } from './repo';
import {} from '@tara/api-client-ts';
import { extractTokenFromAuthHeader, pwdSame } from './utils';
import { answerQuestion, getClassTopics, tokenizeQuestion } from './ai';
import morgan from 'morgan';
import { Middlewares } from './mws';
import { config } from 'dotenv';
import cors from 'cors';
import { Artifact, ArtifactId, ArtifactType } from '@tara/types';

config();

const client = knex({
	client: 'pg',
	connection: process.env.DATABASE_URL || '',
});

const userRepo = new UserRepo(client);
const tokenRepo = new TokenRepo(client);
const courseRepo = new CourseRepo(client);
const artRepo = new ArtifactRepo(client);

const mws = new Middlewares(tokenRepo);

const app = express();

app.use(cors());

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
			return res.json({
				accessToken: accessToken.value,
				userId: accessToken.userId,
			});
		}
		return res.status(401).json({ error: 'Wrong password' });
	} catch (e) {
		next(e);
	}
});

app.post('/chat', mws.authorizedFactory(), async (req, res) => {
	const question = req.body.question;
	const option = req.query.option;
	if (!question) {
		return res.status(400).json({ message: 'Must provide question' });
	}
	if (!option) {
		try {
			const ans = await answerQuestion(question as string);
			const tokenizedResponse = await tokenizeQuestion(question as string);
			return res.json({ data: ans });
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: e });
		}
	} else if (option === 'TOPICS') {
		try {
			const ans = await getClassTopics(question as string);
			return res.json({ data: ans });
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: e });
		}
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

const createArtifactTree = (artifacts: Artifact[]): Artifact[] => {
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
	console.log(artifactMap[rootId]);
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
		// TODO: get artifacts tree
		const artifacts = await artRepo.find({ courseId: course.id });
		course.artifacts = createArtifactTree(artifacts);
		return res.json({ data: course });
	} catch (e) {
		next(e);
	}
});

app.post('/courses/:id/artifacts', async (req, res, next) => {
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

app.use((err, req, res, next) => {
	console.error(err);
	return res.status(500).json({ error: err });
});

const port = process.env.PORT || 3333;
app.listen(port, async () => {
	console.log(`Listening at http://localhost:${port}`);
});
