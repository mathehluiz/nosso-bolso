import { Module } from '@nestjs/common'
import { OrganizationModule } from './organization/organization.module'
import { ConfigModule } from './shared/module/config/config.module'
import { TransactionModule } from './transaction/transaction.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrganizationModule,
    TransactionModule,
  ],
})
export class AppModule {}
