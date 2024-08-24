import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { AuthService } from './core/service/authentication.service'
import { UserManagementService } from '../org-management/core/service/user-management.service'
import { UserRepository } from '../org-management/persistence/repository/user.repository'
import { AuthController } from './http/auth.controller'
import { ConfigService } from '@src/shared/module/config/config.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
    PersistenceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserManagementService, UserRepository],
})
export class IdentityModule {}
