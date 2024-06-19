import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { Device } from '../schema/device.schema';
import { DevicesService } from './device.services';

// Mock data
const mockDevice = {
  name: 'light',
  type: 'Thermostat',
  status: 'Active',
  location: 'Bangkok',
};

// Mock Mongoose model instance
class MockDeviceModel {
  constructor(private data) {}

  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockDevice]),
  });
  static findById = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockDevice),
  });
  static findByIdAndUpdate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockDevice),
  });
  static findByIdAndDelete = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockDevice),
  });
}

describe('DevicesService', () => {
  let service: DevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: getModelToken(Device.name),
          useValue: MockDeviceModel,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new device', async () => {
    const createDeviceDto: CreateDeviceDto = {
      name: 'light',
      type: 'Thermostat',
      status: 'Active',
      location: 'Bangkok',
    };

    const result = await service.create(createDeviceDto);
    expect(result).toEqual(mockDevice);
  });

  it('should return all devices', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockDevice]);
  });

  it('should return a device by id', async () => {
    const result = await service.findOne('someId');
    expect(result).toEqual(mockDevice);
  });

  it('should update a device', async () => {
    const updateDeviceDto = { status: 'Inactive' };
    const result = await service.update('someId', updateDeviceDto);
    expect(result).toEqual(mockDevice);
  });

  it('should delete a device', async () => {
    const result = await service.remove('someId');
    expect(result).toEqual(mockDevice);
  });
});
