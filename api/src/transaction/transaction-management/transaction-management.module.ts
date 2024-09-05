import { Module } from '@nestjs/common'
import { IdentityModule } from '@src/organization/identity/identity.module'
import { TransactionManagementService } from './core/service/transaction-management.service'
import { TransactionController } from './http/rest/controller/transaction.controller'
import { TransactionRepository } from './persistence/repository/transaction.repository'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { EventEmitterModule } from '@src/shared/module/event/event-emitter.module'

@Module({
  imports: [IdentityModule, PersistenceModule, EventEmitterModule],
  controllers: [TransactionController],
  providers: [TransactionManagementService, TransactionRepository],
})
export class TransactionManagementModule {}
