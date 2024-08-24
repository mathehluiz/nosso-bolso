import { Module } from '@nestjs/common'
import { OrganizationManagementModule } from './org-management/org-management.module'

@Module({
  imports: [OrganizationManagementModule],
})
export class OrganizationModule {}
