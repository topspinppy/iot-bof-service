import { Injectable } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
@Schema({ timestamps: true })
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(newUser: CreateUserDto): Promise<User> {
    const { email, password, userName, fullName } = newUser;
    const hashPassword = await this.hashPassword(password);
    console.log(hashPassword);
    const createdUser = new this.userModel({
      userName,
      password: hashPassword,
      fullName,
      email,
    });

    console.log(createdUser, {
      userName,
      password: hashPassword,
      fullName,
      email,
    });

    try {
      const user = await createdUser.save();
      console.log('Saved User:', user);
      return user;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
