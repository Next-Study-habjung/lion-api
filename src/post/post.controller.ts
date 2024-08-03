import {
	Body,
	Controller,
	Delete,
	Get,
	Header,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
	PostListResponseDto,
	PostReportResponseDto,
	PostRequestDto,
	PostResponseDto,
	PostSingleResponseDto,
} from './dto/post.dto';
import { JwtAuthGuard } from '@user/auth/guards/jwt-auth.guard';
import { CommentService } from './comment/comment.service';
import {
	CommentListResponseDto,
	CommentRequestDto,
	CommentResponseDto,
} from './comment/dto/comment.dto';
import { HandleErrors } from 'src/util/error-decorator';

@ApiTags('post')
@Controller()
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly commentService: CommentService,
	) {}

	@Get('/')
	@ApiOperation({ summary: '모든 게시물 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getAllPost(
		@Query('limit') limit: string,
		@Query('skip') skip: string,
		@Req() req,
	): Promise<PostListResponseDto> {
		const limitValue = limit ? parseInt(limit) : 10;
		const skipValue = skip ? parseInt(skip) : 0;
		return this.postService.getAllPost(req.user._id, limitValue, skipValue);
	}

	@Get('/feed')
	@ApiOperation({ summary: '피드 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getFeedPost(
		@Query('limit') limit: string,
		@Query('skip') skip: string,
		@Req() req,
	): Promise<PostListResponseDto> {
		const limitValue = limit ? parseInt(limit) : 10;
		const skipValue = skip ? parseInt(skip) : 0;
		return this.postService.getFeedPost(req.user._id, limitValue, skipValue);
	}

	@Get(':accountname/userpost')
	@ApiOperation({ summary: '특정 유저 게시물 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getUserPost(
		@Param('accountname') accountname: string,
		@Query('limit') limit: string,
		@Query('skip') skip: string,
		@Req() req,
	): Promise<PostResponseDto> {
		const limitValue = limit ? parseInt(limit) : 10;
		const skipValue = skip ? parseInt(skip) : 0;
		return this.postService.getUserPost(req.user._id, accountname, limitValue, skipValue);
	}

	@Get(':post_id')
	@ApiOperation({ summary: '게시물 상세 정보 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getPostDetail(
		@Param('post_id') postId: string,
		@Req() req,
	): Promise<PostSingleResponseDto> {
		return this.postService.getPostDetail(req.user._id, postId);
	}

	@Post('/')
	@ApiOperation({ summary: '게시물 생성' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiBody({ type: PostRequestDto })
	async createPost(
		@Body() post: PostRequestDto,
		@Req() req,
	): Promise<PostSingleResponseDto> {
		return this.postService.createPost(req.user._id, post.post);
	}

	@Put(':post_id')
	@ApiOperation({ summary: '게시물 수정' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiBody({ type: PostRequestDto })
	async updatePost(
		@Param('post_id') postId: string,
		@Body() post: PostRequestDto,
		@Req() req,
	): Promise<PostSingleResponseDto> {
		return this.postService.updatePost(postId, req.user._id, post.post);
	}

	@Delete(':post_id')
	@ApiOperation({ summary: '게시물 삭제' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async deletePost(
		@Param('post_id') postId: string,
		@Req() req,
	): Promise<{ message: string }> {
		return this.postService.deletePost(postId, req.user._id);
	}

	@Post(':post_id/report')
	@ApiOperation({ summary: '게시물 신고' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async reportPost(@Param('post_id') postId: string): Promise<PostReportResponseDto> {
		return this.postService.reportPost(postId);
	}

	@Post(':post_id/comments')
	@ApiOperation({ summary: '댓글 생성' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiBody({ type: CommentRequestDto })
	async createComment(
		@Param('post_id') postId: string,
		@Body() comment: CommentRequestDto,
		@Req() req,
	): Promise<CommentResponseDto> {
		await this.postService.getPostById(postId);
		const response = this.commentService.createComment(
			postId,
			comment.comment,
			req.user._id,
		);
		await this.postService.increaseCommentCount(postId);
		return response;
	}

	@Get(':post_id/comments')
	@ApiOperation({ summary: '댓글 리스트 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getCommentList(
		@Param('post_id') postId: string,
		@Query('limit') limit: string,
		@Query('skip') skip: string,
		@Req() req,
	): Promise<CommentListResponseDto> {
		const limitValue = limit ? parseInt(limit) : 10;
		const skipValue = skip ? parseInt(skip) : 0;
		await this.postService.getPostById(postId);
		return this.commentService.getCommentList(
			postId,
			req.user._id,
			limitValue,
			skipValue,
		);
	}

	@Delete(':post_id/comments/:comment_id')
	@ApiOperation({ summary: '댓글 삭제' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async deleteComment(
		@Param('post_id') postId: string,
		@Param('comment_id') commentId: string,
		@Req() req,
	) {
		await this.postService.getPostById(postId);
		const response = this.commentService.deleteComment(commentId, req.user._id);
		await this.postService.decreaseCommentCount(postId);
		return response;
	}

	@Post(':post_id/comments/:comment_id/report')
	@ApiOperation({ summary: '댓글 신고' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async reportComment(
		@Param('post_id') postId: string,
		@Param('comment_id') commentId: string,
	) {
		await this.postService.getPostById(postId);
		return this.commentService.reportComment(commentId);
	}

	@Post(':post_id/heart')
	@ApiOperation({ summary: '좋아요' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async likePost(
		@Param('post_id') postId: string,
		@Req() req,
	): Promise<PostSingleResponseDto> {
		return this.postService.likePost(postId, req.user._id);
	}

	@Delete(':post_id/unheart')
	@ApiOperation({ summary: '좋아요 취소' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async unlikePost(
		@Param('post_id') postId: string,
		@Req() req,
	): Promise<PostSingleResponseDto> {
		return this.postService.unlikePost(postId, req.user._id);
	}
}
