import axios, { Axios } from "axios";

export class APIClient {
	url: string
	axios: Axios
	constructor(url: string) {
		this.url = url;
		this.axios = axios.create({
			baseURL: url,
		})
	}
	setAccessToken(token: string) {
		this.axios = axios.create({
			baseURL: this.url,
			headers: {
				Authorization: `Bearer ${token}`,
			}
		})
	}
	async metrics(): Promise<{error?: any}> {
		const res = await axios.post(`${this.url}/metrics`);
		if(res.status>=400) {
			return {error: res.data.error}
		}
		return {};
	}
	async register(email: string, password: string): Promise<{accessToken?: string, error?: any}> {
		const res = await axios.post(`${this.url}/auth/register`, {
			data: {email, password}
		});
		if(res.status>=400) {
			return {error: res.data.error}
		}
		return {accessToken: res.data.accessToken};
	}
	async login(email: string, password: string): Promise<{accessToken?: string, error?: any}> {
		const res = await axios.post(`${this.url}/auth/login`, {
			data: {email, password}
		});
		if(res.status>=400) {
			return {error: res.data.error}
		}
		return {accessToken: res.data.accessToken};
	}
	// async createCourse(name: string): Promise<{id?: number, error?: any}> {
	// 	const res = await axios.post(`${this.url}/classes`, {
	// 		data: {name}
	// 	});
	// 	if(res.status>=400) {
	// 		return {error: res.data.error}
	// 	}
	// 	return {id: res.data.id};
	// }
}