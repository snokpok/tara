import express from 'express';
import knex from 'knex';
import { ArtifactRepo, CourseRepo, TokenRepo, UserRepo } from './repo';
import {} from '@tara/api-client-ts';
import { extractTokenFromAuthHeader, pwdSame } from './utils';
import { answerQuestion, getClassTopics, tokenizeQuestion } from './ai';
import morgan from 'morgan';
import { Middlewares } from './mws';
import { config } from 'dotenv';
import cors from 'cors'
import {ArtifactType} from '@tara/types'

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

app.use(cors())

app.use(express.json());
app.use(morgan('dev'));

app.get("/metrics", (req,res) => {
	return res.send("OK");
})

app.post('/auth/register', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if(await userRepo.findUser({email})!==null) {
			return res.status(400).json({error: "User already exists"});
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
		if(user===null) {
			return res.status(400).json({error: "User not found"});
		}
		if (await pwdSame(user.pwdhash, password)) {
			const accessToken = await tokenRepo.findAccessToken({ userId: user.id });
			if(accessToken===null) {
				accessToken.value = await tokenRepo.createAccessTokenForUser(user.id);
				accessToken.userId = user.id;
			}
			return res.json({ accessToken: accessToken.value, userId: accessToken.userId });
		}
		return res.status(401).json({ error: 'Wrong password' });
	} catch(e) {
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

app.post("/courses", async (req,res,next) => {
	try {
		const {name}  = req.body;
		if(!name) {
			return res.status(400).json({error: "Must provide name"});
		}
		const {userId} = await tokenRepo.findAccessToken({token: extractTokenFromAuthHeader(req.headers.authorization)})
		const course = await courseRepo.create(name, userId);
		return res.json({id: course.id})
	} catch (e) {
		next(e)
	}
})

app.get("/courses", async (req,res) => {
	const {userId} = await tokenRepo.findAccessToken({token: extractTokenFromAuthHeader(req.headers.authorization)})
	const courses = await courseRepo.findByOwner(userId);
	return res.json({data: courses})
})

app.get("/courses/:id", async (req,res) => {
	const id = req.params.id;
	if(!id) {
		return res.status(400).json({error: "Must provide course ID"});
	}
	const numid = Number.parseInt(id);
	if(isNaN(numid)) {
		return res.status(400).json({error: "Invalid course ID; must be an integer"});
	}
	const course = await courseRepo.get(numid);
	return res.json({data: course})
})


app.post("/courses/:id/artifacts", async (req,res) => {
	const courseId = req.params.id;
	if(!courseId) {
		return res.status(400).json({error: "Must provide course ID"});
	}
	const courseNumId = Number.parseInt(courseId);
	if(isNaN(courseNumId)) {
		return res.status(400).json({error: "Invalid course ID; must be an integer"});
	}
	const {type, name, solution, parentArtifactId} = req.body
	if(!type || !name) {
		return res.status(400).json({error: "Must provide type and name"});
	}
	// TODO: verify correct type
	const course = courseRepo.get(courseNumId);
	if(course===null) {
		return res.status(404).json({error: "Course not found"});
	}

	const parent = await artRepo.get(parentArtifactId);
	if(parentArtifactId && parent===null) {
		return res.status(404).json({error: "Parent not found"});
	}
	artRepo.create(type, name, courseNumId, parentArtifactId, solution);
	return;
})


app.use((err, req, res, next) => {
	console.error(err);
	return res.status(500).json({ error: err });
});

const port = process.env.PORT || 3333;
app.listen(port, async () => {
	console.log(`Listening at http://localhost:${port}`);
});
