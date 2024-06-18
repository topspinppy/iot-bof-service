import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
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

  @Get('profile/:id')
  @HttpCode(200)
  async getProfile(@Req() request: Request): Promise<User> {
    const user = await this.userService.findById(request.params.id);
    return user;
  }
}
