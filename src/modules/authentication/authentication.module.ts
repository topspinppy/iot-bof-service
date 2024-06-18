import { Global, Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';

@Global()
@Module({
  imports: [],
  providers: [],
  controllers: [AuthenticationController],
  exports: [],
})
export class AuthenticationModule {}
