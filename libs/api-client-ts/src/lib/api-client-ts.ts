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
	async register(email: string, password: string): Promise<{accessToken: string}> {
		const res = await axios.get(`${this.url}/auth/register`, {
			data: {email, password}
		});
		return res.data.accessToken;
	}
	setAccessToken(token: string) {
		this.axios = axios.create({
			baseURL: this.url,
			headers: {
				Authorization: token,
			}
		})
	}
}