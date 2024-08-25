import { Module } from '@nestjs/common'
import { AccountManagementModule } from './account-management/account-management.module'

@Module({
  imports: [AccountManagementModule],
})
export class BankAccountModule {}
