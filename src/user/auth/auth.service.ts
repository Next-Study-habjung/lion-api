// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '@user/user.service';

// @Injectable()
// export class AuthService {
// 	constructor(
// 		private usersService: UserService,
// 		private jwtService: JwtService,
// 	) {}

// 	validateToken(token: string): boolean {
// 		try {
// 			this.jwtService.verify(token);
// 			return true;
// 		} catch {
// 			return false;
// 		}
// 	}

// 	async validateUser(email: string, password: string): Promise<any> {
// 		const user = await this.usersService.validateLogin(email, password);
// 		return user;
// 	}

// 	async login(user: any) {
// 		const payload = { email: user.email, sub: user._id };
// 		return {
// 			accessToken: this.jwtService.sign(payload),
// 		};
// 	}
// }
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { RegisterRequestDto } from '@user/dto/user.dto';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	validateToken(token: string): boolean {
		try {
			this.jwtService.verify(token);
			return true;
		} catch {
			return false;
		}
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.validateLogin(email, password);
		return user;
	}

	async login(user: any) {
		const payload = { email: user.email, sub: user._id };
		return {
			accessToken: this.jwtService.sign(payload),
		};
	}

	async validateKakaoUser(profile: any): Promise<any> {
		const email = profile.kakao_account?.email;
		let user = await this.userService.getUserByAccountName(email);

		if (!user) {
			const registerRequest: RegisterRequestDto = {
				user: {
					email,
					username: profile.properties.nickname,
					accountname: email,
					password: '',
					intro: '',
					image: profile.properties.profile_image || '',
				},
			};
			user = await this.userService.register(registerRequest);
		}

		const payload = { email: user.email, sub: user._id };
		return {
			accessToken: this.jwtService.sign(payload),
		};
	}
}
