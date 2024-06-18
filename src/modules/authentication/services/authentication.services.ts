import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  private _accessTokenJwtService: JwtService;
  private _refreshTokenJwtService: JwtService;

  get accessTokenJwtService() {
    return this._accessTokenJwtService;
  }

  get refreshTokenJwtService() {
    return this._refreshTokenJwtService;
  }
}
