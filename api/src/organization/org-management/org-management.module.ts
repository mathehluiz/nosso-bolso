import { Module } from '@nestjs/common'
import { OrganizationManagementService } from './core/service/org-management.service'
import { MembershipManagementService } from './core/service/membership-management.service'
import { UserManagementService } from './core/service/user-management.service'
import { OrganizationController } from './http/controllers/organization.controller'
import { UserController } from './http/controllers/user.controller'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { OrganizationRepository } from './persistence/repository/organization.repository'
import { UserRepository } from './persistence/repository/user.repository'
import { MembershipRepository } from './persistence/repository/membership.repository'
import { IdentityModule } from '../identity/identity.module'

@Module({
  imports: [PersistenceModule, IdentityModule],
  controllers: [OrganizationController, UserController],
  providers: [
    OrganizationManagementService,
    MembershipManagementService,
    UserManagementService,
    OrganizationRepository,
    UserRepository,
    MembershipRepository,
  ],
  exports: [UserRepository, OrganizationRepository, MembershipRepository],
})
export class OrganizationManagementModule {}
