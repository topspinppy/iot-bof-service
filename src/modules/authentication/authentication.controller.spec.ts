import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';

import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from '../shared/guards/auth.guard';
import { UserService } from '../users/service/user.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './services/authentication.services';

const fakeConfig = {
  JWT_ACCESS_TOKEN_SECRET_KEY: 'eOPbB9EMAoxFDwrZx0M8bJOWiOPCor40y7kfXhRJG7RKe4wmz2QEz98P1WTOzx53',
  JWT_ACCESS_TOKEN_EXPIRES_IN: '5m',
  JWT_REFRESH_TOKEN_SECRET_KEY: 'rtpTa5wXRo72wsEHlQM1T5J5OD4PnQOJgwxAoNm85anXaxRUo5nsLUtFmNoSQOtw',
  JWT_REFRESH_TOKEN_EXPIRES_IN: '10080m',
} as const;

const mockResponse = mocks.createResponse();
const mockCredential = {
  _id: '626e7f227a5ab81151fce0f5',
  email: 'test@mercular.com',
  password: 'test',
} as const;

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return fakeConfig[key];
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            verifyPassword: jest.fn((email: string, password: string) => {
              const { _id, email: mockEmail, password: mockPassword } = mockCredential;
              if (email === mockEmail && password === mockPassword) {
                return { _id };
              } else {
                return null;
              }
            }),
            updateLastLoggedInAt: jest.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(APP_INTERCEPTOR)
      .useClass(AuthenticationGuard)
      .compile();

    controller = app.get<AuthenticationController>(AuthenticationController);
  });

  describe('passwordLogin', () => {
    it('should throw "UnauthorizedException" because invalid email or password.', async () => {
      // Arrange
      const fakeInvalidCredential = {
        email: 'test@test.com',
        password: 'wrong_pwd',
      } as const;
      // Act
      const testFunc = async () => await controller.login(fakeInvalidCredential, mockResponse);

      // Assert
      await expect(testFunc()).rejects.toThrowError(UnauthorizedException);
    });

    it('should return "token" expires within 5 minutes.', async () => {
      // Arrange
      const NOW = Date.now();

      // Act
      const response = await controller.login(mockCredential, mockResponse);

      // Assert
      expect(response.accessTokenExpiresAt.getTime()).toBeGreaterThanOrEqual(NOW);
      expect(response.refreshTokenExpiresAt.getTime()).toBeGreaterThanOrEqual(NOW);
    });
  });
});
