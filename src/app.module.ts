import { Module } from '@nestjs/common'
import { OrganizationModule } from './organization/organization.module'
import { ConfigModule } from './shared/module/config/config.module'
import { TransactionModule } from './transaction/transaction.module'
import { BankAccountModule } from './bank-account/bank-account.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrganizationModule,
    TransactionModule,
    BankAccountModule,
  ],
})
export class AppModule {}
