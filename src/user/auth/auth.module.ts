import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from 'src/oauth/kakao.strategy';
import { OAuthService } from 'src/oauth/oauth.service';
import { OAuthController } from 'src/oauth/oauth.controller';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			useFactory: async () => ({
				secret: process.env.JWT_SECRET,
				signOptions: { expiresIn: '60d' },
			}),
		}),
	],
	controllers: [AuthController, OAuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, KakaoStrategy, OAuthService],
	exports: [AuthService],
})
export class AuthModule {}
