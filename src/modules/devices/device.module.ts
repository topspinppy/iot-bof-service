import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './device.controller';
import { Device, DeviceSchema } from './schema/device.schema';
import { DevicesService } from './services/device.services';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }])],
  providers: [DevicesService],
  controllers: [DeviceController],
  exports: [],
})
export class DeviceModule {}
