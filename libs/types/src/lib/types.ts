export type ArtifactType = 'QUESTION'| 'PROJECT'| 'LAB'| 'EXAM' | "UNIDENTIFIED"; // TODO: more?

export type UserId = number;

export class User {
	id: UserId;
	email: string;
	pwdhash: string;
	constructor(){
		this.id = -1;
		this.email = "";
		this.pwdhash = "";
	}
}

export class AccessToken {
	value: string;
	userId: UserId;
	constructor(){
		this.value = "";
		this.userId = -1;
	}
}

export class Artifact {
	id: number;
	type: ArtifactType;
	name: string;
	constructor(){
		this.id = -1;
		this.type = "UNIDENTIFIED";
		this.name = "";
	}
}