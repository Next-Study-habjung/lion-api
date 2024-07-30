import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from '@image/image.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from './user/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from '@product/product.module';
import { PostModule } from '@post/post.module';
import { ProfileModule } from '@user/profile.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
		}),
		MongooseModule.forRoot(process.env.DB_URL),
		UserModule,
		ImageModule,
		AuthModule,
		ProductModule,
		PostModule,
		ProfileModule,
	],
})
export class AppModule {}
