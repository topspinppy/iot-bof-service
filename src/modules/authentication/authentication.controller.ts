import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { AuthenticationGuard } from '../shared/guards/auth.guard';
import { LoginRequestDTO } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response.dto';
import { AuthenticationService, AuthenticationTokens, TokenType } from './services/authentication.services';

export class TokenExpiredResult {
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthenticationController {
  constructor(
    private readonly config: ConfigService,
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post('/login')
  async login(
    @Body() loginRequest: LoginRequestDTO,
    @Res({ passthrough: true }) response: Response
  ): Promise<ResponseLoginDto> {
    const { email, password } = loginRequest;
    const user = await this.authenticationService.loginWithPassword(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authenticationService.createAuthenticationTokens(user._id.toString());

    this.setResponseCookie(tokens, response);

    const { accessTokenExpiresAt, refreshTokenExpiresAt } = tokens;
    return {
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOkResponse({
    description: 'The user has been successfully logged-out.',
    type: TokenExpiredResult,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid authorization header or cookie.',
  })
  logout(@Res({ passthrough: true }) response: Response): TokenExpiredResult {
    const lastDay = dayjs().add(-1, 'day').toDate();
    const expiredToken = {
      accessToken: '',
      accessTokenExpiresAt: lastDay,
      refreshToken: '',
      refreshTokenExpiresAt: lastDay,
    };

    this.setResponseCookie(expiredToken, response);

    const { accessTokenExpiresAt, refreshTokenExpiresAt } = expiredToken;
    return {
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  @Post('/refresh')
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOkResponse({
    description: 'The user has been successfully logged-out.',
    type: ResponseLoginDto,
  })
  async refreshTokenCookie(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<ResponseLoginDto> {
    const refreshToken = request.cookies[TokenType.RefreshToken];
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh cookie.');
    }

    const payload = await this.authenticationService.verifyRefreshToken(refreshToken);

    const tokens = await this.authenticationService.createAuthenticationTokens(payload.id);
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
