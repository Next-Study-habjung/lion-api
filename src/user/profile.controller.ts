import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	Header,
	Param,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@user/auth/guards/jwt-auth.guard';
import { FollowResponseDto, InfoResponseDto } from './dto/profile.dto';
import { HandleErrors } from '@util/error-decorator';

@ApiTags('profile')
@Controller()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':accountname')
	@ApiOperation({ summary: '내 계정 정보 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiBody({ type: InfoResponseDto })
	async getProfile(
		@Req() req,
		@Param('accountname') accountname: string,
	): Promise<InfoResponseDto> {
		return await this.profileService.getProfile(req.user._id, accountname);
	}

	@Post(':accountname/follow')
	@ApiOperation({ summary: '팔로우하기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async follow(
		@Req() req,
		@Param('accountname') accountname: string,
	): Promise<FollowResponseDto> {
		if (req.user._id == accountname) {
			throw new BadRequestException('자기 자신을 팔로우 할 수 없습니다.');
		}
		return await this.profileService.follow(req.user._id, accountname);
	}

	@Delete(':accountname/unfollow')
	@ApiOperation({ summary: '팔로우 취소' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async unfollow(
		@Req() req,
		@Param('accountname') accountname: string,
	): Promise<FollowResponseDto> {
		if (req.user._id == accountname) {
			throw new BadRequestException('자기 자신을 언팔로우 할 수 없습니다.');
		}
		return await this.profileService.unfollow(req.user._id, accountname);
	}

	@Get(':accountname/following')
	@ApiOperation({ summary: '팔로잉 리스트' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getFollowingList(
		@Req() req,
		@Param('accountname') accountname: string,
		@Query('limit') limit: string,
		@Query('skip') skip: string,
	): Promise<FollowResponseDto[]> {
		const limitValue = limit ? parseInt(limit) : 10;
		const skipValue = skip ? parseInt(skip) : 0;

		return await this.profileService.getFollowingList(
			req.user._id,
			accountname,
			limitValue,
			skipValue,
		);
	}

	@Get(':accountname/follower')
	@ApiOperation({ summary: '나를 팔로우 한 사용자 목록' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getFollowerList(
		@Req() req,
		@Param('accountname') accountname: string,
		@Query('limit') limit: string,
		@Query('skip') skip: string,
	): Promise<FollowResponseDto[]> {
		const limitValue = limit ? parseInt(limit) : 10;
		const skipValue = skip ? parseInt(skip) : 0;

		return await this.profileService.getFollowerList(
			req.user._id,
			accountname,
			limitValue,
			skipValue,
		);
	}
}
