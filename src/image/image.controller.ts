import {
	Controller,
	Post,
	UploadedFiles,
	UploadedFile,
	UseInterceptors,
	Get,
	Param,
	Res,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@config/multer.config';
import { ImageService } from './image.service';
import { Response } from 'express';
import path from 'path';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('image')
@Controller()
export class ImageController {
	constructor(private readonly imageService: ImageService) {}

	@Post('uploadfile')
	@ApiOperation({ summary: '파일 업로드' })
	@UseInterceptors(FileInterceptor('image', multerConfig))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		return this.imageService.uploadFile(file);
	}

	@Post('uploadfiles')
	@ApiOperation({ summary: '파일 여러개 업로드' })
	@UseInterceptors(FilesInterceptor('image', 3, multerConfig))
	uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
		return this.imageService.uploadFiles(files);
	}

	@Get('uploads/:filename')
	@ApiOperation({ summary: '이미지 가져오기' })
	async getImage(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = path.join('uploads', filename);
		res.sendFile(filePath, { root: '.' });
	}
}
