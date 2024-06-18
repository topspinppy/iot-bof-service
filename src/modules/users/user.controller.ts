import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(201)
  async create(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.userService.create(createUser);
  }
}
