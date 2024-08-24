import { ChangePasswordDto } from '@src/organization/org-management/core/service/user-management.service'
import { IsNotEmpty, IsString } from 'class-validator'

export class ChangePasswordRequestDto implements Omit<ChangePasswordDto, 'userId'> {
  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  newPassword: string
}
