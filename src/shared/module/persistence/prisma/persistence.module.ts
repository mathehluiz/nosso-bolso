import { Module } from '@nestjs/common'
import { ConfigModule } from '@src/shared/module/config/config.module'
import { PrismaService } from './prisma.service'

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PersistenceModule {}
