import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { AuthService } from './core/service/authentication.service'
import { UserManagementService } from '../org-management/core/service/user-management.service'
import { UserRepository } from '../org-management/persistence/repository/user.repository'
import { AuthController } from './http/auth.controller'
import { MembershipManagementService } from '../org-management/core/service/membership-management.service'
import { MembershipRepository } from '../org-management/persistence/repository/membership.repository'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '4h' },
    }),
    PersistenceModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserManagementService,
    MembershipManagementService,
    MembershipRepository,
    UserRepository,
  ],
  exports: [UserManagementService, MembershipManagementService],
})
export class IdentityModule {}
