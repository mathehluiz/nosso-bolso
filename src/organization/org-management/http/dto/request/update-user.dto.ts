import { UpdateUserDto } from '@src/organization/org-management/core/service/user-management.service'
import { IsOptional, IsString } from 'class-validator'

export class UpdateUserRequestDto implements Omit<UpdateUserDto, 'id'> {
  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsString()
  name?: string
}
