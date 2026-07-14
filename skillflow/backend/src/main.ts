import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/errors/domain-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // API Versioning — supports breaking changes without frontend impact
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Convertit les DomainError (métier) en bons codes HTTP — doit être avant les pipes
  app.useGlobalFilters(new DomainExceptionFilter());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('SkillFlow API')
    .setDescription('API de la plateforme SkillFlow')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
