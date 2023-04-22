import express from 'express';
import knex from 'knex';
import { TokenRepo, UserRepo } from './repo';
import {} from '@tara/api-client-ts';
import { pwdSame } from './utils';
import { answerQuestion, getClassTopics, tokenizeQuestion } from './ai';
import morgan from 'morgan';
import { Middlewares } from './mws';
import { config } from 'dotenv';

config();

(async () => {
	const client = knex({
		client: 'pg',
		connection: process.env.DATABASE_URL || '',
	});

	const userRepo = new UserRepo(client);
	const tokenRepo = new TokenRepo(client);
	const mws = new Middlewares(tokenRepo);

	const app = express();

	app.use(express.json());
	app.use(morgan('dev'));

	app.get("/metrics", (req,res) => {
		throw new Error("hello")
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
			if (await pwdSame(user.pwdhash, password)) {
				const accessToken = await tokenRepo.findAccessToken({ userId: user.id });
				if(accessToken===null) {
					accessToken.value = await tokenRepo.createAccessTokenForUser(user.id);
					accessToken.userId = user.id;
				}
				return res.json({ accessToken: accessToken.value });
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

	app.use((err, req, res, next) => {
		console.error(err);
		return res.status(500).json({ error: err });
	});

	const port = process.env.PORT || 3333;
	app.listen(port, async () => {
		console.log(`Listening at http://localhost:${port}`);
	});
})();
