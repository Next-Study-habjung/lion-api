import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// const port = process.env.PORT || 8080;

	app.use(express.static(path.join(__dirname, '..', 'uploads')));
	app.use(cors());

	// Set up Swagger
	const config = new DocumentBuilder()
		.setTitle('API Documentation')
		.setDescription('The API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
		}),
	);

	await app.listen(8080);
	// console.log(`listening on port ${port}`);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
