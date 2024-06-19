import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../schema/user.schema';
import { UserService } from './user.service';

const mockUser = (
  id = '4edd40c86762e0fb12000003',
  email = 'test@example.com',
  password = 'password',
  userName = 'testuser',
  fullName = 'Test User'
): User => ({
  _id: new Types.ObjectId(id),
  email,
  password,
  userName,
  fullName,
});

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            create: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        userName: 'testuser',
        fullName: 'Test User',
      };

      const hashedPassword = 'hashedPassword';

      jest.spyOn(service, 'hashPassword').mockResolvedValue(hashedPassword);
      jest.spyOn(userModel, 'create').mockResolvedValue({
        ...createUserDto,
        _id: new Types.ObjectId(),
        password: hashedPassword,
      } as any);

      const user = await service.create(createUserDto);

      expect(service.hashPassword).toHaveBeenCalledWith('password');
      expect(user.password).toBeUndefined();
      expect(user.email).toBe(createUserDto.email);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userId = '4edd40c86762e0fb12000003';
      const user = mockUser(userId);

      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const foundUser = await service.findById(userId);

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe('test@example.com');
    });
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      jest.spyOn(bcrypt, 'hash' as any).mockResolvedValue('hashedPassword');

      const hash = await service.hashPassword('password');

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(hash).toBe('hashedPassword');
    });
  });

  describe('findByEmailForValidation', () => {
    it('should find a user by email for validation', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser()),
      } as any);

      const user = await service.findByEmailForValidation('test@example.com');

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });
  });

  describe('verifyPassword', () => {
    it('should verify the password', async () => {
      const user = mockUser();
      jest.spyOn(service, 'findByEmailForValidation').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);

      const result = await service.verifyPassword('test@example.com', 'password');

      expect(service.findByEmailForValidation).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', user.password);
      expect(result).toBe(user);
    });

    it('should return null if password is incorrect', async () => {
      jest.spyOn(service, 'findByEmailForValidation').mockResolvedValue(mockUser());
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false);

      const result = await service.verifyPassword('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(service, 'findByEmailForValidation').mockResolvedValue(null);

      const result = await service.verifyPassword('test@example.com', 'password');

      expect(result).toBeNull();
    });
  });
});
