import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/errors/domain-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({ origin: ['http://localhost:4000', 'http://localhost:3000'], credentials: true })

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
  const keycloakBase = 'http://localhost:8080/realms/skillflow/protocol/openid-connect';
  const config = new DocumentBuilder()
    .setTitle('SkillFlow API')
    .setDescription('API de la plateforme SkillFlow')
    .setVersion('1.0')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: `${keycloakBase}/auth`,
          tokenUrl: `${keycloakBase}/token`,
          scopes: { openid: 'OpenID', profile: 'Profile', email: 'Email' },
        },
      },
    }, 'keycloak')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/docs/oauth2-redirect.html',
      initOAuth: {
        clientId: 'skillflow-frontend',
        scopes: ['openid', 'profile', 'email'],
        usePkceWithAuthorizationCodeGrant: true,
      },
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
