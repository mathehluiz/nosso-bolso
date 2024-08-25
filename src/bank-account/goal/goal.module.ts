import { Module } from '@nestjs/common'
import { IdentityModule } from '@src/organization/identity/identity.module'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { GoalController } from './http/controller/rest/goal.controller'
import { GoalService } from './core/service/goal.service'

@Module({
  imports: [IdentityModule, PersistenceModule],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
