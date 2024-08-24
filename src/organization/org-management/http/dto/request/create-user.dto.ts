import { CreateUserDto } from '@src/organization/org-management/core/service/user-management.service'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateUserRequestDto implements CreateUserDto {
  @IsOptional()
  @IsString()
  avatar?: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string
}
