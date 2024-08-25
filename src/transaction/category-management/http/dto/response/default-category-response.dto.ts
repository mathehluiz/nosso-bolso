import { DefaultResponseDto } from '@src/shared/http/dto/default-response.dto'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class DefaultCategoryResponseDto extends DefaultResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  color: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  organizationId: string

  @Expose()
  @IsString()
  @IsOptional()
  description?: string
}
