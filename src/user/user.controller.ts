// import {
// 	Body,
// 	Controller,
// 	Header,
// 	Post,
// 	Put,
// 	Get,
// 	UseGuards,
// 	Req,
// 	Query,
// } from '@nestjs/common';
// import { ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
// import { UserService } from './user.service';
// import {
// 	AccountNameValidRequestDto,
// 	EmailValidRequestDto,
// 	ProfileUpdateRequestDto,
// 	ProfileResponseDto,
// 	RegisterRequestDto,
// } from './dto/user.dto';
// import { HandleErrors } from '@util/error-decorator';
// import { JwtAuthGuard } from '@user/auth/guards/jwt-auth.guard';

// @ApiTags('user')
// @Controller('user')
// export class UserController {
// 	constructor(private readonly userService: UserService) {}

// 	@Post('/')
// 	@ApiOperation({ summary: '회원가입' })
// 	@Header('content-type', 'application/json')
// 	@HandleErrors()
// 	@ApiBody({ type: RegisterRequestDto })
// 	async register(@Body() body: RegisterRequestDto) {
// 		return await this.userService.register(body);
// 	}

// 	@Post('/emailvalid')
// 	@ApiOperation({ summary: '이메일 중복 검사' })
// 	@ApiQuery({
// 		name: 'email',
// 		required: true,
// 		description: '중복 확인할 이메일',
// 	})
// 	@Header('content-type', 'application/json')
// 	@HandleErrors()
// 	async validateEmail(@Body() user: EmailValidRequestDto) {
// 		const { email } = user.user;
// 		return await this.userService.validateEmail(email);
// 	}

// 	@Post('/accountnamevalid')
// 	@ApiOperation({ summary: '계정 중복 검사' })
// 	@Header('content-type', 'application/json')
// 	@HandleErrors()
// 	async validateAccountName(@Body() user: AccountNameValidRequestDto) {
// 		const { accountname } = user.user;
// 		return await this.userService.validateAccountName(accountname);
// 	}

// 	@Put()
// 	@ApiOperation({ summary: '유저 정보 수정' })
// 	@Header('content-type', 'application/json')
// 	@UseGuards(JwtAuthGuard)
// 	@HandleErrors()
// 	async updateProfile(
// 		@Req() req,
// 		@Body() body: ProfileUpdateRequestDto,
// 	): Promise<ProfileResponseDto> {
// 		return await this.userService.updateProfile(req.user._id, body);
// 	}

// 	@Get('me')
// 	@ApiOperation({ summary: '내 정보 조회' })
// 	@Header('content-type', 'application/json')
// 	@UseGuards(JwtAuthGuard)
// 	@HandleErrors()
// 	async getMyInfo(@Req() req): Promise<ProfileResponseDto> {
// 		return await this.userService.getMyInfo(req.user._id);
// 	}

// 	@Get('searchuser')
// 	@ApiOperation({ summary: '유저 검색' })
// 	@Header('content-type', 'application/json')
// 	@UseGuards(JwtAuthGuard)
// 	@HandleErrors()
// 	async searchUser(@Req() req, @Query('keyword') keyword: string) {
// 		return await this.userService.searchUsers(keyword, req.user._id);
// 	}
// }
import {
	Body,
	Controller,
	Header,
	Post,
	Put,
	Get,
	UseGuards,
	Req,
	Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
	AccountNameValidRequestDto,
	EmailValidRequestDto,
	ProfileUpdateRequestDto,
	ProfileResponseDto,
	RegisterRequestDto,
} from './dto/user.dto';
import { HandleErrors } from '@util/error-decorator';
import { JwtAuthGuard } from '@user/auth/guards/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/')
	@ApiOperation({ summary: '회원가입' })
	@Header('content-type', 'application/json')
	@HandleErrors()
	@ApiBody({ type: RegisterRequestDto })
	async register(@Body() body: RegisterRequestDto) {
		return await this.userService.register(body);
	}

	@Post('/emailvalid')
	@ApiOperation({ summary: '이메일 중복 검사' })
	@ApiQuery({
		name: 'email',
		required: true,
		description: '중복 확인할 이메일',
		example: 'user@example.com',
	})
	@ApiBody({ type: EmailValidRequestDto }) // 요청 본문에 대한 설명 추가
	@Header('content-type', 'application/json')
	@HandleErrors()
	async validateEmail(@Body() user: EmailValidRequestDto) {
		// EmailValidRequestDto의 구조를 유지하면서 query parameter로 email을 받도록 수정
		const { email } = user.user;
		return await this.userService.validateEmail(email);
	}

	@Post('/accountnamevalid')
	@ApiOperation({ summary: '계정 중복 검사' })
	@Header('content-type', 'application/json')
	@HandleErrors()
	@ApiBody({ type: AccountNameValidRequestDto }) // 요청 본문에 대한 설명 추가
	async validateAccountName(@Body() user: AccountNameValidRequestDto) {
		const { accountname } = user.user;
		return await this.userService.validateAccountName(accountname);
	}

	@Put()
	@ApiOperation({ summary: '유저 정보 수정' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiBody({ type: ProfileUpdateRequestDto }) // 요청 본문에 대한 설명 추가
	async updateProfile(
		@Req() req,
		@Body() body: ProfileUpdateRequestDto,
	): Promise<ProfileResponseDto> {
		return await this.userService.updateProfile(req.user._id, body);
	}

	@Get('me')
	@ApiOperation({ summary: '내 정보 조회' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getMyInfo(@Req() req): Promise<ProfileResponseDto> {
		return await this.userService.getMyInfo(req.user._id);
	}

	@Get('searchuser')
	@ApiOperation({ summary: '유저 검색' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiQuery({
		name: 'keyword',
		required: true,
		description: '검색할 키워드',
		example: 'john_doe',
	})
	async searchUser(@Req() req, @Query('keyword') keyword: string) {
		return await this.userService.searchUsers(keyword, req.user._id);
	}
}
