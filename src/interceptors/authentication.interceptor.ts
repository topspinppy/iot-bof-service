import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';
import {
  AuthenticationService,
  TokenType,
} from 'src/modules/authentication/services/authentication.services';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.getAccessToken(request);
    const payload =
      await this.authenticationService.verifyAccessToken(accessToken);

    if (this.authenticationService.isAccessTokenDenied()) {
      throw new UnauthorizedException('Access token denied');
    }

    request.user = {
      id: payload.id,
      accessTokenJti: payload.jti,
    };

    return next.handle();
  }

  private getAccessToken(request: Request): string {
    const headerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (headerToken) return headerToken;

    const accessToken = request.cookies[TokenType.AccessToken];
    if (!accessToken) {
      throw new UnauthorizedException(
        'Invalid authorization header or cookie.',
      );
    }

    if (!request.headers.origin) {
      return accessToken;
    }

    const authOrigin = this.configService.get<string>('AUTH_ORIGIN');
    if (
      authOrigin !== '*' &&
      !authOrigin?.split(',').includes(request.headers.origin)
    ) {
      throw new UnauthorizedException('Invalid auth origin');
    }

    return accessToken;
  }
}
