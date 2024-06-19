import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'light', description: 'Device Name' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Thermostat', description: 'Device Type' })
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['Active', 'Inactive'])
  @ApiProperty({ example: 'Active', description: 'Device Status' })
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bangkok', description: 'Location' })
  readonly location: string;
}
