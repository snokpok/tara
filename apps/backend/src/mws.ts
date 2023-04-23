import { NextFunction, Request, Response } from 'express';
import { TokenRepo } from './repo';

export class Middlewares {
	constructor(private readonly tokenRepo: TokenRepo) {}
	authorizedFactory() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const token = req.headers.authorization.replace('Bearer', '').trim();
			const at = await this.tokenRepo.findAccessToken({ token });
			if (!token || at === null) {
				return res.status(401).json({ message: 'UNAUTHORIZED' });
			}
			next();
		};
	}
}
