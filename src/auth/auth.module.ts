import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../common/mail/mail.module';
import { TokenGeneratorModule } from '../common/token-generator/token-generator.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guard/roles.guard';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({}), MailModule, TokenGeneratorModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
