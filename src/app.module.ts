import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './core/exception/HttpExceptionFilter';
import { PrismaModule } from './prisma/prisma.module';
import { UniversityModule } from './university/university.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, PrismaModule, UniversityModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
