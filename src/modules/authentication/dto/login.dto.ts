import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true, example: 'my_password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
