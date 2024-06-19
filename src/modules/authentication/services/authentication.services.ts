import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

import { JsonWebTokenError, JwtService, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { User } from 'src/modules/users/schema/user.schema';
import { UserService } from 'src/modules/users/user.service';

export interface AuthenticationTokens {
  readonly accessToken: string;
  readonly accessTokenExpiresAt: Date;
  readonly refreshToken: string;
  readonly refreshTokenExpiresAt: Date;
}

export enum TokenType {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
}

export interface JwtPayload {
  readonly id: string;
  readonly jti: string;
  readonly type: TokenType;
  readonly iat?: number;
  readonly exp?: number;
}

@Injectable()
export class AuthenticationService {
  private _accessTokenJwtService: JwtService;
  private _refreshTokenJwtService: JwtService;

  constructor(
    readonly config: ConfigService,
    private readonly userService: UserService
  ) {
    this._accessTokenJwtService = new JwtService({
      secret: config.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
      signOptions: { expiresIn: config.get('JWT_ACCESS_TOKEN_EXPIRES_IN') },
    });

    this._refreshTokenJwtService = new JwtService({
      secret: config.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
      signOptions: { expiresIn: config.get('JWT_REFRESH_TOKEN_EXPIRES_IN') },
    });
  }

  async verifyAccessToken(accessToken: string): Promise<JwtPayload> {
    return await this.verifyToken(accessToken, TokenType.AccessToken, this.accessTokenJwtService);
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    return await this.verifyToken(refreshToken, TokenType.RefreshToken, this.refreshTokenJwtService);
  }

  async loginWithPassword(email: string, password: string): Promise<User> {
    const user = await this.userService.verifyPassword(email, password);
    return user;
  }

  async createAuthenticationTokens(userId: string): Promise<AuthenticationTokens> {
    const accessToken = await this.accessTokenJwtService.signAsync({
      id: userId,
      jti: uuid(),
      type: TokenType.AccessToken,
    });
    const accessTokenPayload = await this.verifyAccessToken(accessToken);
    const accessTokenExpiresAt = new Date(accessTokenPayload.exp * 1000);

    const refreshToken = await this.refreshTokenJwtService.signAsync({
      id: userId,
      jti: uuid(),
      type: TokenType.RefreshToken,
    });
    const refreshTokenPayload = await this.verifyRefreshToken(refreshToken);

    const refreshTokenExpiresAt = new Date(refreshTokenPayload.exp * 1000);

    //Insert DB
    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  get accessTokenJwtService() {
    return this._accessTokenJwtService;
  }

  get refreshTokenJwtService() {
    return this._refreshTokenJwtService;
  }

  private async verifyToken(token: string, tokenType: TokenType, jwtService: JwtService): Promise<JwtPayload> {
    let payload: JwtPayload;
    try {
      payload = await jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException(`Invalid ${tokenType}`);
      } else if (e instanceof NotBeforeError) {
        throw new UnauthorizedException(`Early ${tokenType}`);
      } else if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(`Expired ${tokenType}`);
      }
      throw e;
    }
    if (payload.type !== tokenType) {
      throw new UnauthorizedException(`Invalid ${tokenType} type`);
    }
    return payload;
  }

  isAccessTokenDenied(): boolean {
    //Check with deny list
    return false;
  }
}
