import { Module } from '@nestjs/common'
import { IdentityModule } from '@src/organization/identity/identity.module'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { TransactionReportController } from './http/controlller/transaction-report.controller'
import { TransactionReportService } from './core/service/transaction-report.service'
import { TransactionRepository } from '../transaction-management/persistence/repository/transaction.repository'

@Module({
  imports: [IdentityModule, PersistenceModule],
  controllers: [TransactionReportController],
  providers: [TransactionReportService, TransactionRepository],
})
export class TransactionReportModule {}
