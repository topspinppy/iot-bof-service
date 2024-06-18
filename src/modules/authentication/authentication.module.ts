import { Global, Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './services/authentication.services';

@Global()
@Module({
  imports: [UserModule],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
