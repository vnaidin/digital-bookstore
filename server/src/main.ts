import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as path from 'path';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin:
      process.env.APP_MODE === 'development'
        ? /^http:\/\/localhost(:\d+)?$/
        : process.env.APP_HOST || 'http://localhost',
  });

  app.useStaticAssets(
    path.resolve(process.cwd(), process.env.TOKEN_FILES_PATH || 'uploads'),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Digital Bookstore API')
    .setDescription('Digital Bookstore Application API')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = process.env.APP_PORT || 3016;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
