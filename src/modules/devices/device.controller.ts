import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../shared/guards/auth.guard';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './schema/device.schema';
import { DevicesService } from './services/device.services';

@ApiTags('Devices')
@UseGuards(AuthenticationGuard)
@Controller('api/devices')
export class DeviceController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new devices' })
  @ApiBody({ type: CreateDeviceDto })
  async createDevice(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all devices' })
  async getAllDevices(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve details of a specific device by ID.' })
  async getDevice(@Param('id') id: string): Promise<Device> {
    return this.devicesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update details of a specific device by ID' })
  async updateDevice(@Param('id') id: string, @Body() updateDeviceDto: Partial<CreateDeviceDto>): Promise<Device> {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a specific device by ID' })
  async removeDevice(@Param('id') id: string): Promise<Device> {
    return this.devicesService.remove(id);
  }
}
