import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { Types } from 'mongoose';
import { AuthenticationService } from '../authentication/services/authentication.services';
import { AuthenticationGuard } from '../shared/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        AuthenticationGuard,
        { provide: ConfigService, useValue: {} },
        { provide: AuthenticationService, useValue: {} },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(APP_INTERCEPTOR)
      .useClass(AuthenticationGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
        userName: 'johndoe',
      };

      const createdUser: UserDocument | any = {
        id: '4edd40c86762e0fb12000003',
        ...createUserDto,
      };

      jest.spyOn(userService, 'create').mockResolvedValueOnce(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toBe(createdUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getProfileById', () => {
    it('should return user profile by id', async () => {
      const userId = new Types.ObjectId('4edd40c86762e0fb12000003');
      const mockRequest = {
        params: { id: userId },
      } as unknown as Request;

      const user: UserDocument | any = {
        _id: userId,
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
        userName: 'johndoe',
      };
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);

      const result = await controller.getProfileById(mockRequest);

      expect(result).toBe(user);
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('getCurrentProfile', () => {
    it('should return current user profile', async () => {
      const userId = new Types.ObjectId('4edd40c86762e0fb12000003');
      const requestMock = {
        user: {
          id: userId,
        },
      };

      const user: UserDocument | any = {
        _id: userId,
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
        userName: 'johndoe',
      };

      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);

      const result = await controller.getCurrentProfile(requestMock as any);

      expect(result).toBe(user);
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });
  });
});
