export type ArtifactType = 'QUESTION'| 'PROJECT'| 'LAB'| 'EXAM' | "UNIDENTIFIED"; // TODO: more?

export type UserId = number;
export type CourseId = number;
export type ArtifactId = number;

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
	id: ArtifactId;
	type: ArtifactType;
	name: string;
	courseId: CourseId;
	parentId: ArtifactId
	children?: Artifact[];
	constructor(){
		this.id = -1;
		this.type = "UNIDENTIFIED";
		this.name = "";
		this.courseId = -1;
		this.parentId = -1;
	}
}

export class Course {
	id: CourseId;
	name: string;
	artifacts: Artifact[];
	constructor(){
		this.id = -1;
		this.name = "";
		this.artifacts = [];
	}
}