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
    const createdUser = new this.userModel({
      userName,
      password: hashPassword,
      fullName,
      email,
    });

    const user = await createdUser.save();
    user.password = undefined;
    return user;
  }

  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById({ _id: userId });
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async findByEmailForValidation(email: string): Promise<User> {
    const query = { email };
    return await this.userModel.findOne(query);
  }

  async verifyPassword(email: string, password: string): Promise<User> {
    const user = await this.findByEmailForValidation(email);
    if (!user) return null;
    const validPassword = await bcrypt.compare(password, user.password);
    return validPassword ? user : null;
  }
}
