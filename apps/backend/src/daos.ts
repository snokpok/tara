import {ArtifactId, CourseId, UserId} from '@tara/types'

export class ATFilterRequest {
	userId?: UserId;
	token?: string;
}

export class UserFilterRequest {
	id?: UserId;
	email?: string;
}

export class ArtifactFilter {
	courseId?: CourseId;
	parentArtifactId?: ArtifactId
	id?: ArtifactId;
}