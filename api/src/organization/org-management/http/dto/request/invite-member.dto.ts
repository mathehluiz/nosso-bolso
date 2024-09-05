import { InviteMemberDto } from '@src/organization/org-management/core/service/org-management.service'
import { IsNotEmpty, IsString } from 'class-validator'

export class InviteMemberRequestDto implements Omit<InviteMemberDto, 'organizationId'> {
  @IsNotEmpty()
  @IsString()
  email: string
}
