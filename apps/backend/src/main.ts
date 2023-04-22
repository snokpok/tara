/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { NextFunction } from 'express';
import knex from 'knex';
import { TokenRepo, UserRepo } from './repo';
import {} from '@tara/api-client-ts';
import { pwdSame } from './utils';
import { answerQuestion } from './ai';

const client = knex({
	client: 'mysql',
	connection: process.env.DATABASE_URL || '',
});

const userRepo = new UserRepo(client);
const tokenRepo = new TokenRepo(client);

const app = express();

app.use(express.json());

app.post('/auth/register', async (req, res) => {
	const { email, password } = req.body;
	const user = await userRepo.createUser(email, password);
	const accessToken = await tokenRepo.createAccessTokenForUser(user.id);
	return res.json({ token: accessToken });
});

app.post('/auth/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await userRepo.findUser({ email });
	if (pwdSame(user.pwdhash, password)) {
		const accessToken = await tokenRepo.findAccessToken({ userId: user.id });
		return res.json({ accessToken });
	}
	return res.status(401).json({ message: 'UNAUTHORIZED' });
});

app.post('/chat', async (req,res) => {
	const question = req.body.question;
	if(!question) {
		return res.status(400).json({message: "Must provide question"})
	}
	try {
		const ans = await answerQuestion(question as string);
		return res.json({data: ans});
	} catch (e) {
		console.error(e);
		return res.status(500).json({error: e});
	}
});

app.use((err,req,res,next: NextFunction) => {
	console.error(err);
	next()
})

const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
	console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
