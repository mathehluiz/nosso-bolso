import { Module } from '@nestjs/common'
import { ConfigModule } from './shared/module/config/config.module'
import { OrganizationModule } from './organization/organization.module'

@Module({
  imports: [ConfigModule.forRoot(), OrganizationModule],
})
export class AppModule {}
