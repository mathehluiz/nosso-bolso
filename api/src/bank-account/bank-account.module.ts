import { Module } from '@nestjs/common'
import { AccountManagementModule } from './account-management/account-management.module'
import { GoalModule } from './goal/goal.module'

@Module({
  imports: [AccountManagementModule, GoalModule],
})
export class BankAccountModule {}
