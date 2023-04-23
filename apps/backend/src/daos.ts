import {UserId} from '@tara/types'

export class ATFilterRequest {
	userId?: UserId;
	token?: string;
}

export class UserFilterRequest {
	id?: UserId;
	email?: string;
}