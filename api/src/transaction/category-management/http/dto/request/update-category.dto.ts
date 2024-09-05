import { UpdateCategoryDto } from '@src/transaction/category-management/core/service/category-management.service'
import { IsOptional, IsString } from 'class-validator'

export class UpdateCategoryRequestDto implements Omit<UpdateCategoryDto, 'id'> {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  color?: string

  @IsString()
  @IsOptional()
  description?: string
}
