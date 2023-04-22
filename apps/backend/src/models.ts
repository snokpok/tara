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

export type ArtifactType = 'QUESTION'| 'PROJECT'| 'LAB'| 'EXAM'; // TODO: more?

export class Artifact {
	id: number;
	type: ArtifactType;
	name: string;
}