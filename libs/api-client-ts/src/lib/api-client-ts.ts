import axios, { Axios } from 'axios';
import {
	Artifact,
	ArtifactId,
	ArtifactType,
	Course,
	CourseId,
} from '@tara/types';

export class APIClient {
	url: string;
	axios: Axios;
	constructor(url: string) {
		this.url = url;
		this.axios = axios.create({
			baseURL: url,
			withCredentials: true,
			validateStatus: () => true,
		});
	}
	setAccessToken(token: string) {
		this.axios = axios.create({
			baseURL: this.url,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
			validateStatus: () => true,
		});
	}
	async metrics(): Promise<{ error?: any }> {
		const res = await axios.get(`${this.url}/metrics`);
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		return {};
	}
	async register(
		email: string,
		password: string
	): Promise<{ accessToken?: string; error?: any }> {
		const res = await axios.post(`${this.url}/auth/register`, {
			data: { email, password },
		});
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		return { accessToken: res.data.accessToken };
	}
	async login(
		email: string,
		password: string
	): Promise<{ data?: { accessToken: string; userId: string }; error?: any }> {
		try {
			const res = await axios.post(`${this.url}/auth/login`, {
				email,
				password,
			});
			if (res.status >= 400) {
				return { error: res.data.error };
			}
			return {
				data: { accessToken: res.data.accessToken, userId: res.data.userId },
			};
		} catch (e: any) {
			if (e.response.status >= 400) return { error: e.response.data };
			return { error: 'Could not connect' };
		}
	}
	async createCourse(name: string): Promise<{ id?: number; error?: any }> {
		const res = await this.axios.post(`${this.url}/courses`, {
			name,
		});
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		return { id: res.data.id };
	}
	async getCourses(): Promise<{ data?: Course[]; error?: any }> {
		const res = await this.axios.get(`${this.url}/courses`);
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		return { data: res.data.data as Course[] };
	}
	async getCourse(id: CourseId): Promise<{ data?: Course; error?: any }> {
		const res = await this.axios.get(`${this.url}/courses/${id}`);
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		const course = new Course();
		course.id = res.data.data.id;
		course.artifacts = res.data.data.artifacts;
		course.name = res.data.data.name;
		return { data: course };
	}
	async addCourseArtifact(
		courseId: CourseId,
		{
			type,
			name,
			solution,
			parentArtifactId,
		}: {
			type: ArtifactType;
			name: string;
			solution?: string;
			parentArtifactId?: ArtifactId;
		}
	): Promise<{ id?: number; error?: any }> {
		const res = await this.axios.post(`${this.url}/courses/${courseId}/artifacts`, {
			type,
			name,
			solution,
			parentArtifactId,
		});
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		return { id: res.data.id };
	}
	async deleteCourseArtifact(
		courseId: CourseId,
		artifactId: ArtifactId
	): Promise<{ error?: any }> {
		const res = await axios.delete(
			`${this.url}/courses/${courseId}/artifacts/${artifactId}`
		);
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		return {};
	}
	async editCourseArtifact(
		courseId: CourseId,
		artifactId: ArtifactId,
		edit: Partial<Artifact>
	): Promise<{ error?: any }> {
		const res = await this.axios.put(
			`${this.url}/courses/${courseId}/artifacts/${artifactId}`,
			edit
		);
		if (res.status >= 400) {
			return { error: res.data.error };
		}
		return {};
	}
}
