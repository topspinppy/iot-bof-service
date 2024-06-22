import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({ required: true, example: 'admin1@test.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true, example: '12345' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
