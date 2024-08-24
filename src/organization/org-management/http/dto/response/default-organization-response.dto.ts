import { Expose } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class DefaultOrganizationResponseDto {
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
  ownerId: string

  @IsString()
  @IsNotEmpty()
  @Expose()
  slug: string

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
  deletedAt: Date | null
}
