// import { Controller, Get, Headers, Header, Post, Req, UseGuards } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './guards/local-auth.guard';
// import { HandleErrors } from '@util/error-decorator';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';

// @ApiTags('auth')
// @Controller()
// export class AuthController {
// 	constructor(private readonly authService: AuthService) {}

// 	@UseGuards(LocalAuthGuard)
// 	@HandleErrors()
// 	@Post('user/login')
// 	@ApiOperation({ summary: '로그인' })
// 	async logIn(@Req() req) {
// 		const jwt = await this.authService.login(req.user);
// 		return {
// 			user: {
// 				...req.user,
// 				token: jwt.accessToken,
// 			},
// 		};
// 	}

// 	@Get('user/checktoken')
// 	@ApiOperation({ summary: '토큰 확인' })
// 	@Header('content-type', 'application/json')
// 	async checkToken(@Req() req, @Headers('Authorization') authorization: string) {
// 		if (!authorization || !authorization.startsWith('Bearer ')) {
// 			return { isValid: false };
// 		}
// 		const token = authorization.split(' ')[1];
// 		const isValid = this.authService.validateToken(token);
// 		return { isValid };
// 	}
// }
import { Controller, Get, Headers, Header, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HandleErrors } from '@util/error-decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@HandleErrors()
	@Post('user/login')
	@ApiOperation({ summary: '로그인' })
	async logIn(@Req() req) {
		const jwt = await this.authService.login(req.user);
		return {
			user: {
				...req.user,
				token: jwt.accessToken,
			},
		};
	}

	@Get('user/checktoken')
	@ApiOperation({ summary: '토큰 확인' })
	@Header('content-type', 'application/json')
	async checkToken(@Req() req, @Headers('Authorization') authorization: string) {
		if (!authorization || !authorization.startsWith('Bearer ')) {
			return { isValid: false };
		}
		const token = authorization.split(' ')[1];
		const isValid = this.authService.validateToken(token);
		return { isValid };
	}
}
