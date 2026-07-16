import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from '@modules/courses/courses.module';
import { UsersModule } from '@modules/users/users.module';
import { QuizzesModule } from '@modules/quizzes/quizzes.module';
import { CertificatesModule } from '@modules/certificates/certificates.module';
import { EnrollmentsModule } from '@modules/enrollments/enrollments.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CorrelationIdMiddleware } from './shared/middleware/correlation-id.middleware';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
    UsersModule,
    QuizzesModule,
    CertificatesModule,
  ],
  providers: [
    // JwtAuthGuard global : toutes les routes nécessitent un token JWT
    // sauf celles décorées avec @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
