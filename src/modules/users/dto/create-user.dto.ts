import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly userName: string;
}
