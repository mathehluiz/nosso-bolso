import { Module } from '@nestjs/common'
import { TransactionManagementModule } from './transaction-management/transaction-management.module'

@Module({
  imports: [TransactionManagementModule],
})
export class TransactionModule {}
