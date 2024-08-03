import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Req,
	UseGuards,
	Header,
	Query,
	Put,
	Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
	CreateProductDTO,
	UpdateProductDTO,
	ProductResponse,
	ProductListDTO,
} from './product.dto';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '@user/auth/guards/jwt-auth.guard';
import { HandleErrors } from '@util/error-decorator';

@ApiTags('product')
@Controller()
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post('/')
	@ApiOperation({ summary: '상품 등록' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiBody({ type: CreateProductDTO })
	async createProduct(
		@Body() productDTO: CreateProductDTO,
		@Req() req,
	): Promise<ProductResponse> {
		return this.productService.createProduct(productDTO, req.user._id);
	}

	@Get('/:accountname')
	@ApiOperation({ summary: '상품 리스트 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getProductList(
		@Query('limit') limit: string,
		@Query('skip') skip: string,
		@Param('accountname') accountname: string,
	): Promise<ProductListDTO> {
		const limitNumber = limit ? parseInt(limit) : 10;
		const skipNumber = skip ? parseInt(skip) : 0;
		return this.productService.getProductList(accountname, limitNumber, skipNumber);
	}

	@Get('/detail/:productId')
	@ApiOperation({ summary: '상품 상세 정보 가져오기' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async getProductDetail(
		@Param('productId') productId: string,
		@Req() req,
	): Promise<ProductResponse> {
		return this.productService.getProductDetail(productId, req.user._id);
	}

	@Put('/:product_id')
	@ApiOperation({ summary: '상품 정보 수정' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	@ApiBody({ type: UpdateProductDTO })
	async updateProduct(
		@Req() req,
		@Param('product_id') productId: string,
		@Body() productDTO: UpdateProductDTO,
	): Promise<ProductResponse> {
		return this.productService.updateProduct(productId, productDTO, req.user._id);
	}

	@Delete('/:product_id')
	@ApiOperation({ summary: '상품 삭제' })
	@Header('content-type', 'application/json')
	@UseGuards(JwtAuthGuard)
	@HandleErrors()
	async deleteProduct(@Req() req, @Param('product_id') productId: string) {
		return this.productService.deleteProduct(productId, req.user._id);
	}
}
