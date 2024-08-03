import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '@user/auth/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.KAKAO_CLIENT_ID,
			clientSecret: process.env.KAKAO_CLIENT_SECRET,
			callbackURL: process.env.KAKAO_REDIRECT_URI,
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: (error: any, user?: any, info?: any) => void,
	): Promise<void> {
		try {
			const jwt = await this.authService.validateKakaoUser(profile);
			done(null, jwt);
		} catch (err) {
			done(err, false);
		}
	}
}
