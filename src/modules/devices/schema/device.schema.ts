import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from 'src/modules/users/schema/user.schema';

export type DeviceDocument = User & Document;

@Schema({ timestamps: true })
export class Device {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({
    type: String,
    isRequired: true,
    trim: true,
    maxLength: 100,
  })
  name: string;

  @Prop({
    type: String,
    isRequired: true,
    trim: true,
    maxLength: 100,
  })
  type: string;

  @Prop({
    type: String,
    isRequired: true,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  })
  status: string;

  @Prop({
    type: String,
    isRequired: true,
    trim: true,
  })
  location: string;
}

const DeviceSchema = SchemaFactory.createForClass(Device);
DeviceSchema.plugin(mongoosePaginate);

export { DeviceSchema };
