import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './core/exception/HttpExceptionFilter';
import { PrismaModule } from './prisma/prisma.module';
import { UniversityModule } from './university/university.module';
import { UserModule } from './user/user.module';
import { ActivityTypeModule } from './activityType/activityType.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    UniversityModule,
    ActivityTypeModule,
    ActivityModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
