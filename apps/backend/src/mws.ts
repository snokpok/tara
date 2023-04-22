import { NextFunction, Request, Response } from 'express';
import { TokenRepo } from './repo';

export class Middlewares {
	constructor(private readonly tokenRepo: TokenRepo) {}
	async authorized() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const token = req.headers.authorization;
			if ((await this.tokenRepo.findAccessToken({ token })) !== null) {
				next();
				return;
			}
			return res.status(401).json({ message: 'UNAUTHORIZED' });
		};
	}
}
