import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { Device } from '../schema/device.schema';

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device.name) private readonly deviceModel: Model<Device>) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const createdDevice = new this.deviceModel(createDeviceDto);
    return createdDevice.save();
  }

  async findAll(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }

  async findOne(id: string): Promise<Device> {
    return this.deviceModel.findById(id).exec();
  }

  async update(id: string, updateDeviceDto: Partial<CreateDeviceDto>): Promise<Device> {
    return this.deviceModel.findByIdAndUpdate(id, updateDeviceDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Device> {
    return this.deviceModel.findByIdAndDelete(id).exec();
  }
}
