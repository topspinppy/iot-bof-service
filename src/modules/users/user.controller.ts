import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticationGuard } from '../shared/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './service/user.service';

@ApiTags('Users')
@UseGuards(AuthenticationGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new users' })
  @HttpCode(201)
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.userService.create(createUser);
  }

  @Get('profile/:id')
  @HttpCode(200)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get profile by id' })
  @ApiOkResponse({ type: User })
  async getProfileById(@Req() request: Request): Promise<User> {
    const user = await this.userService.findById(request.params.id);
    return user;
  }

  @Get('profile')
  @HttpCode(200)
  @ApiOperation({ summary: 'Returns a current user profile.' })
  @ApiOkResponse({ type: User })
  async getCurrentProfile(@Req() request: Request): Promise<User> {
    const userId = request.user['id'];
    const user = await this.userService.findById(userId);
    return user;
  }
}
