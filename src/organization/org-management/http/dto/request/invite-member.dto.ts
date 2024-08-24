import { Role } from '@src/organization/org-management/core/enum/role.enum'
import { InviteMemberDto } from '@src/organization/org-management/core/service/org-management.service'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class InviteMemberRequestDto implements Omit<InviteMemberDto, 'organizationId'> {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsEnum(['OWNER', 'MEMBER'])
  role: Role
}
