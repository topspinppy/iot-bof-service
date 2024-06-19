import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({
    type: String,
    unique: true,
    isRequired: true,
    trim: true,
    maxLength: 100,
  })
  userName: string;

  @Prop({
    type: String,
    unique: false,
    isRequired: true,
    trim: true,
    maxLength: 100,
  })
  password: string;

  @Prop({
    type: String,
    isRequired: true,
    trim: true,
    maxLength: 100,
  })
  fullName: string;

  @Prop({
    type: String,
    unique: true,
    isRequired: true,
    trim: true,
    maxLength: 100,
  })
  email: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);

export { UserSchema };
