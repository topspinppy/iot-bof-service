import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { LoginRequestDTO } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response.dto';
import {
  AuthenticationService,
  AuthenticationTokens,
  TokenType,
} from './services/authentication.services';

@Controller('api/auth')
export class AuthenticationController {
  constructor(
    private readonly config: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('/login')
  async login(
    @Body() loginRequest: LoginRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseLoginDto> {
    const { email, password } = loginRequest;
    const user = await this.authenticationService.loginWithPassword(
      email,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authenticationService.createAuthenticationTokens(
      user._id.toString(),
    );

    this.setResponseCookie(tokens, response);

    const { accessTokenExpiresAt, refreshTokenExpiresAt } = tokens;
    return {
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  private setResponseCookie(token: AuthenticationTokens, response: Response) {
    const secure = !this.config.get<boolean>('AUTH_COOKIE_UNSECURE');
    response.cookie(TokenType.AccessToken, token.accessToken, {
      expires: new Date(token.accessTokenExpiresAt),
      httpOnly: true,
      sameSite: 'none',
      secure,
      path: '/api/',
    });
    response.cookie(TokenType.RefreshToken, token.refreshToken, {
      expires: new Date(token.refreshTokenExpiresAt),
      httpOnly: true,
      sameSite: 'none',
      secure,
      path: '/api/auth/refresh',
    });
  }
}
