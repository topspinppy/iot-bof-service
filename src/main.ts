import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigSchema } from './config.schema';

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

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port, () => {
    Logger.log(`Server is running at port ${port}`);
  });
}

void bootstrap();
