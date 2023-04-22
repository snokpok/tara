import { UserId } from './models';

export class ATFilterRequest {
	userId?: UserId;
	token?: string;
}

export class UserFilterRequest {
	id?: UserId;
	email?: string;
}
