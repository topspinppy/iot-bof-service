import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigSchema } from './config.schema';

import * as express from 'express';

function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('IOT Backoffice API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<ConfigSchema>>(ConfigService);

  // Swagger Document
  useSwagger(app);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors({
    origin: '*',
  });

  const port = configService.get<number>('PORT', 2000);
  await app.listen(port, () => {
    Logger.log(`Server is running at port ${port}`);
  });
}

void bootstrap();
