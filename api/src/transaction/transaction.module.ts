import { Module } from '@nestjs/common'
import { TransactionManagementModule } from './transaction-management/transaction-management.module'
import { CategoryManagementModule } from './category-management/category-management.module'
import { TransactionReportModule } from './transaction-report/transaction-report.module'

@Module({
  imports: [
    TransactionManagementModule,
    CategoryManagementModule,
    TransactionReportModule,
  ],
})
export class TransactionModule {}
