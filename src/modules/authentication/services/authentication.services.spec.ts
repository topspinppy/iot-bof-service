import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { describe } from 'node:test';
import { UserService } from '../../users/service/user.service';
import { MockAuthenticationService } from '../mocks/authentication.mock';
import { AuthenticationService, JwtPayload, TokenType } from './authentication.services';

// Mock JwtService for testing
class MockJwtService {
  async verifyAsync(token: string): Promise<JwtPayload> {
    // Mock payload for valid token
    const validPayload: JwtPayload = {
      id: 'user-id',
      jti: 'jwt-id',
      type: TokenType.AccessToken,
      iat: Math.floor(Date.now() / 1000) - 10, // Issued 10 seconds ago
      exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    };

    // Mock payload for expired token
    const expiredPayload: JwtPayload = {
      id: 'user-id',
      jti: 'jwt-id',
      type: TokenType.AccessToken,
      iat: Math.floor(Date.now() / 1000) - 3600, // Issued 1 hour ago (expired)
      exp: Math.floor(Date.now() / 1000) - 1, // Expired 1 second ago
    };

    // Mock payload for token with invalid type
    const invalidTypePayload: JwtPayload = {
      id: 'user-id',
      jti: 'jwt-id',
      type: TokenType.RefreshToken, // Different token type
      iat: Math.floor(Date.now() / 1000) - 10,
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    if (token === 'valid-access-token') {
      return validPayload;
    } else if (token === 'expired-access-token') {
      return expiredPayload;
    } else if (token === 'invalid-type-token') {
      return invalidTypePayload;
    } else {
      throw new Error('Invalid token');
    }
  }
}

const mockUserService = {
  verifyPassword: jest.fn().mockResolvedValue('my_user'),
};

describe('Authentication Service', () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        ConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_ACCESS_TOKEN_SECRET_KEY':
                  return MockAuthenticationService.accessTokenSecretMock;
                case 'JWT_REFRESH_TOKEN_SECRET_KEY':
                  return MockAuthenticationService.refreshTokenSecretMock;
                case 'JWT_ACCESS_TOKEN_EXPIRES_IN':
                  return '3600'; // Mock expiration time
                case 'JWT_REFRESH_TOKEN_EXPIRES_IN':
                  return '86400'; // Mock expiration time
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authenticationService = moduleRef.get(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ Happy cases', () => {
    test('create service, should be created successfully', () => {
      // Assert
      expect(authenticationService.accessTokenJwtService).toBeDefined();
      expect(authenticationService.refreshTokenJwtService).toBeDefined();
    });

    test('should successfully log in with a password', async () => {
      // Arrange
      const email = 'top@gmail.com';
      const password = '1234';
      // Act
      await authenticationService.loginWithPassword(email, password);
      // Assert
      expect(mockUserService.verifyPassword).toHaveBeenCalledTimes(1);
    });

    test('should be verify access token', async () => {
      // Arrange
      const { accessTokenMock, accessTokenPayloadMock } = MockAuthenticationService;

      // Act
      const payload = await authenticationService.verifyAccessToken(accessTokenMock);

      // Assert
      expect(payload).toBeDefined();
      expect(payload.id).toBe(accessTokenPayloadMock.id);
      expect(payload.jti).toBe(accessTokenPayloadMock.jti);
      expect(payload.type).toBe(accessTokenPayloadMock.type);
      expect(payload.exp).toBe(accessTokenPayloadMock.exp);
      expect(payload.iat).toBe(accessTokenPayloadMock.iat);
    });

    test('should be verify refresh token', async () => {
      // Arrange
      const { refreshTokenMock, refreshTokenPayloadMock } = MockAuthenticationService;

      // Act
      const payload = await authenticationService.verifyRefreshToken(refreshTokenMock);

      // Assert
      expect(payload).toBeDefined();
      expect(payload.id).toBe(refreshTokenPayloadMock.id);
      expect(payload.jti).toBe(refreshTokenPayloadMock.jti);
      expect(payload.type).toBe(refreshTokenPayloadMock.type);
      expect(payload.exp).toBe(refreshTokenPayloadMock.exp);
      expect(payload.iat).toBe(refreshTokenPayloadMock.iat);
    });

    test('should create authentication tokens', async () => {
      // Arrange
      const userId = 'user-id-123';
      const accessToken = 'access-token-mock';
      const refreshToken = 'refresh-token-mock';

      const accessTokenPayload: JwtPayload = {
        id: 'user-id-123',
        jti: '4df00630-b831-41af-8c8a-fd142bdfe04f',
        type: TokenType.AccessToken,
        iat: 1718790832,
        exp: 1718790835,
      };

      const refreshTokenPayload: JwtPayload = {
        id: 'user-id-123',
        jti: '4df00630-b831-41af-8c8a-fd142bdfe04f',
        type: TokenType.RefreshToken,
        iat: 1718790832,
        exp: 1718790835,
      };

      jest.spyOn(authenticationService.accessTokenJwtService, 'signAsync').mockResolvedValue('access-token-mock');
      jest.spyOn(authenticationService.refreshTokenJwtService, 'signAsync').mockResolvedValue('refresh-token-mock');
      jest.spyOn(authenticationService, 'verifyAccessToken').mockResolvedValue(accessTokenPayload);
      jest.spyOn(authenticationService, 'verifyRefreshToken').mockResolvedValue(refreshTokenPayload);

      // Act
      const tokens = await authenticationService.createAuthenticationTokens(userId);

      // Assert
      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBe(accessToken);
      expect(tokens.refreshToken).toBe(refreshToken);
      expect(tokens.accessTokenExpiresAt).toEqual(new Date(accessTokenPayload.exp * 1000));
      expect(tokens.refreshTokenExpiresAt).toEqual(new Date(refreshTokenPayload.exp * 1000));
      expect(authenticationService.accessTokenJwtService.signAsync).toHaveBeenCalledWith(expect.any(Object));
      expect(authenticationService.refreshTokenJwtService.signAsync).toHaveBeenCalledWith(expect.any(Object));
      expect(authenticationService.verifyAccessToken).toHaveBeenCalledWith(accessToken);
      expect(authenticationService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('❌ Failed Cases', () => {
    test('verify with invalid access token, should be throw error', async () => {
      // Arrange
      const { refreshTokenMock } = MockAuthenticationService;

      // Act
      const verifyAccessToken = async () => {
        return await authenticationService.verifyAccessToken(refreshTokenMock);
      };

      // Assert
      await expect(verifyAccessToken).rejects.toThrow(UnauthorizedException);
      await expect(verifyAccessToken).rejects.toThrow('Invalid accessToken');
    });

    test('verify with invalid refresh token, should be throw error', async () => {
      // Arrange
      const { accessTokenMock } = MockAuthenticationService;

      // Act
      const verifyRefreshToken = async () => {
        return await authenticationService.verifyRefreshToken(accessTokenMock);
      };

      // Assert
      await expect(verifyRefreshToken).rejects.toThrow(UnauthorizedException);
      await expect(verifyRefreshToken).rejects.toThrow('Invalid refreshToken');
    });
  });
});
