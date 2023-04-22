import express, { NextFunction } from 'express';
import knex from 'knex';
import { TokenRepo, UserRepo } from './repo';
import {} from '@tara/api-client-ts';
import { pwdSame } from './utils';
import { answerQuestion, getClassTopics, tokenizeQuestion } from './ai';
import morgan from 'morgan';
import { Middlewares } from './mws';
import {config} from 'dotenv'

config();

const client = knex({
	client: 'pg',
	connection: process.env.DATABASE_URL || '',
});

const userRepo = new UserRepo(client);
const tokenRepo = new TokenRepo(client);
const mw = new Middlewares(tokenRepo);

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.post('/auth/register', async (req, res) => {
	const { email, password } = req.body;
	const user = await userRepo.createUser(email, password);
	const accessToken = await tokenRepo.createAccessTokenForUser(user.id);
	return res.json({ token: accessToken });
});

app.post('/auth/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await userRepo.findUser({ email });
	if (await pwdSame(user.pwdhash, password)) {
		const accessToken = await tokenRepo.findAccessToken({ userId: user.id });
		return res.json({ accessToken });
	}
	return res.status(401).json({ message: 'UNAUTHORIZED' });
});

app.post('/chat', mw.authorizedFactory(), async (req, res) => {
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

app.use((err, req, res, next: NextFunction) => {
	console.error(err);
	next();
});

const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
	console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
