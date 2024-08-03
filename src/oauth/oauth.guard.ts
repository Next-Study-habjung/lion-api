import { BadRequestException, CanActivate } from '@nestjs/common';

export class OAuthGuard implements CanActivate {
	canActivate(context: Parameters<CanActivate['canActivate']>[0]) {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization;
		if (!token) {
			throw new BadRequestException('Token is required');
		}
		request.token = token.replace('Bearer ', '');
		return true;
	}
}
