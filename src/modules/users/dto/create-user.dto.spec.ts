import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = Object.assign(new CreateUserDto(), {
      email: 'email@example.com',
      password: 'password',
      fullName: 'John Doe',
      userName: 'johndoe',
    });
  });

  const modifyDto = (modifier: (dto: CreateUserDto) => void) => {
    modifier(dto);
    return dto;
  };

  it('should validate a valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate an invalid DTO with missing properties', async () => {
    modifyDto((dto) => {
      (dto as any).email = '';
      (dto as any).password = '';
      (dto as any).fullName = '';
      (dto as any).userName = '';
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid DTO with incorrect email format', async () => {
    modifyDto((dto) => {
      (dto as any).email = 'invalidemail@x'; // Invalid email format
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isEmail).toBeDefined();
  });

  it('should not validate an invalid DTO with fields exceeding max length', async () => {
    modifyDto((dto) => {
      (dto as any).email = 'a'.repeat(101); // Exceeds max length of 100 characters
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.maxLength).toBeDefined();
  });

  it('should not validate an invalid DTO with non-string values', async () => {
    modifyDto((dto) => {
      (dto as any).password = true; // Invalid type for password
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isString).toBeDefined();
  });
});
