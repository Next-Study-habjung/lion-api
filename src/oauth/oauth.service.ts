import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Providers } from './provider.options';

@Injectable()
export class OAuthService {
	getAuthorizeUrl(provider: keyof typeof Providers, redirectUri: string): string {
		const { clientId, urls } = Providers[provider];
		return `${urls.authorize}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
	}

	async getToken(
		provider: keyof typeof Providers,
		code: string,
		redirectUri: string,
	): Promise<any> {
		const { clientId, urls } = Providers[provider];
		const tokenResponse = await axios.post(
			urls.token,
			{},
			{
				params: {
					grant_type: 'authorization_code',
					client_id: clientId,
					redirect_uri: redirectUri,
					code,
					client_secret: process.env.KAKAO_CLIENT_SECRET,
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
		);
		return tokenResponse.data;
	}

	async getUserInfo(provider: keyof typeof Providers, accessToken: string): Promise<any> {
		const { urls } = Providers[provider];
		const userResponse = await axios.get(urls.me, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return userResponse.data;
	}
}
