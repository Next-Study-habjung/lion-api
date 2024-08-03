import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '@user/auth/auth.service';
import { OAuthService } from './oauth.service';
import { Providers } from './provider.options';

@ApiTags('oauth')
@Controller('oauth')
export class OAuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly oAuthService: OAuthService,
	) {}

	@Get('authorization/:provider')
	async goToAuthorizeUrlByProvider(
		@Param('provider') provider: string,
		@Query('redirect_uri') redirect_uri: string,
		@Res() res: Response,
	) {
		const url = this.oAuthService.getAuthorizeUrl(
			provider.toUpperCase() as keyof typeof Providers,
			redirect_uri,
		);
		return res.redirect(url);
	}

	@Post('signin/:provider')
	async getTokenByProvider(
		@Param('provider') providerFromParam: string,
		@Body('code') code: string,
		@Body('redirectUri') redirectUri: string,
		@Res() res: Response,
	) {
		const provider = providerFromParam.toUpperCase() as keyof typeof Providers;
		try {
			const tokenData = await this.oAuthService.getToken(provider, code, redirectUri);
			const userInfo = await this.oAuthService.getUserInfo(
				provider,
				tokenData.access_token,
			);
			const jwt = await this.authService.validateKakaoUser(userInfo);
			res.json({
				accessToken: jwt.accessToken,
				user: userInfo,
			});
		} catch (error) {
			res
				.status(error.response?.status || 500)
				.json(error.response?.data || error.message);
		}
	}
}
