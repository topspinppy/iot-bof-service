import { validate } from 'class-validator';
import { CreateDeviceDto } from './create-device.dto';

describe('CreateDeviceDto', () => {
  let dto: CreateDeviceDto;

  beforeEach(() => {
    dto = Object.assign(new CreateDeviceDto(), {
      name: 'light',
      type: 'Thermostat',
      status: 'Active',
      location: 'Bangkok',
    });
  });

  const modifyDto = (modifier: (dto: CreateDeviceDto) => void) => {
    modifier(dto as any);
    return dto;
  };

  it('should validate a valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate an invalid DTO with missing properties', async () => {
    modifyDto((dto) => {
      (dto as any).name = '';
      (dto as any).type = '';
      (dto as any).status = '';
      (dto as any).location = '';
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid DTO with incorrect status', async () => {
    modifyDto((dto) => {
      (dto as any).status = 'Unknown';
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isEnum).toBeDefined();
  });

  it('should not validate an invalid DTO with empty status', async () => {
    modifyDto((dto) => {
      (dto as any).status = '';
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
  });

  it('should not validate an invalid DTO with non-string values', async () => {
    modifyDto((dto) => {
      (dto as any).name = 123;
      (dto as any).type = 456;
      (dto as any).status = true;
      (dto as any).location = 789;
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    errors.forEach((error) => {
      expect(error.constraints.isString).toBeDefined();
    });
  });
});
