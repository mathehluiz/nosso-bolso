import { CreateOrganizationDto } from '@src/organization/org-management/core/service/org-management.service'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrganizationRequestDto implements CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsString()
  ownerId: string
}
