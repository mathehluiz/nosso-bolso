import { CreateCategoryDto } from '@src/transaction/category-management/core/service/category.service'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCategoryRequestDto
  implements Omit<CreateCategoryDto, 'organizationId'>
{
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  color?: string

  @IsOptional()
  @IsString()
  description?: string
}
