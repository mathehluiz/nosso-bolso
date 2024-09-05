import { Module } from '@nestjs/common'
import { IdentityModule } from '@src/organization/identity/identity.module'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { AccountManagementController } from './http/rest/controller/account-management.controller'
import { AccountManagementService } from './core/service/account-management.service'
import { BankAccountRepository } from './persistence/repository/bank-account.repository'
import { TransactionManagementEventHandler } from './event/transaction-management.event-handler'

@Module({
  imports: [IdentityModule, PersistenceModule],
  controllers: [AccountManagementController],
  providers: [
    AccountManagementService,
    BankAccountRepository,
    TransactionManagementEventHandler,
  ],
})
export class AccountManagementModule {}
