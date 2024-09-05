import { Module } from '@nestjs/common'
import { IdentityModule } from '@src/organization/identity/identity.module'
import { PersistenceModule } from '@src/shared/module/persistence/prisma/persistence.module'
import { CategoryController } from './http/rest/controller/category.controller'
import { CategoryManagementService } from './core/service/category-management.service'
import { CategoryRepository } from './persistence/repository/category.repository'

@Module({
  imports: [IdentityModule, PersistenceModule],
  controllers: [CategoryController],
  providers: [CategoryManagementService, CategoryRepository],
})
export class CategoryManagementModule {}
