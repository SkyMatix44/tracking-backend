import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    // https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      synchronize: config.database.synchronize,
      // Add here all Database-Entities
      entities: [User],
      maxQueryExecutionTime: 250,
      logging: ['error', 'query'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
