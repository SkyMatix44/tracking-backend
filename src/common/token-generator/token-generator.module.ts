import { Module } from '@nestjs/common';
import { TokenGeneratorService } from './token-generator.service';
@Module({
  imports: [],
  providers: [TokenGeneratorService],
  exports: [TokenGeneratorService],
})
export class TokenGeneratorModule {}
