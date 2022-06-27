import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ActivityController } from './activity/activity.controller';
import { ActivityModule } from './activity/activity.module';
import { ActivityTypeController } from './activityType/activityType.controller';
import { ActivityTypeModule } from './activityType/activityType.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { HttpExceptionFilter } from './core/exception/HttpExceptionFilter';
import { NewsController } from './news/news.controller';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectController } from './project/project.controller';
import { UniversityController } from './university/university.controller';
import { UniversityModule } from './university/university.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    UniversityModule,
    ActivityTypeModule,
    ActivityModule,
    NewsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  /**
   * Add all Controller/Routes where the user must be verified
   * @see https://docs.nestjs.com/middleware#middleware-consumer
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        UserController,
        UniversityController,
        ProjectController,
        NewsController,
        ActivityController,
        ActivityTypeController,
      );
  }
}
