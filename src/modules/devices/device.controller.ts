import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../shared/guards/auth.guard';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './schema/device.schema';
import { DevicesService } from './services/device.services';

@UseGuards(AuthenticationGuard)
@Controller('api/devices')
export class DeviceController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  async createDevice(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  async getAllDevices(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Get(':id')
  async getDevice(@Param('id') id: string): Promise<Device> {
    return this.devicesService.findOne(id);
  }

  @Put(':id')
  async updateDevice(@Param('id') id: string, @Body() updateDeviceDto: Partial<CreateDeviceDto>): Promise<Device> {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  async removeDevice(@Param('id') id: string): Promise<Device> {
    return this.devicesService.remove(id);
  }
}
