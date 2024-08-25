import { Module } from '@nestjs/common'
import { TransactionManagementModule } from './transaction-management/transaction-management.module'
import { CategoryManagementModule } from './category-management/category-management.module'

@Module({
  imports: [TransactionManagementModule, CategoryManagementModule],
})
export class TransactionModule {}
