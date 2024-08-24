import { Expose } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class DefaultUserResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string

  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string

  @IsString()
  @IsNotEmpty()
  @Expose()
  email: string

  @IsString()
  @IsOptional()
  @Expose()
  avatar: string

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  createdAt: Date

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  updatedAt: Date

  @IsDateString()
  @IsOptional()
  @Expose()
  deletedAt: Date | null
}
