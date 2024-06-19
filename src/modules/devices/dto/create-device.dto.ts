import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['Active', 'Inactive'])
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;
}
