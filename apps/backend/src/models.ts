export type UserId = number;

export class User {
	id: UserId;
	email: string;
	pwdhash: string;
}

export class AccessToken {
	value: string;
	userId: UserId;
}
