import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequestDTO } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response.dto';

@Controller('api/auth')
export class AuthenticationController {
  constructor() {}

  @Post('/login')
  async login(@Body() loginRequest: LoginRequestDTO): Promise<ResponseLoginDto> {
    const { email, password } = loginRequest;
    console.log(email, password);
    return {
      accessTokenExpiresAt: new Date(),
      refreshTokenExpiresAt: new Date(),
    };
  }
}
