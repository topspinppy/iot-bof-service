import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({ required: true, example: 'admin@admin.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true, example: '1234' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
