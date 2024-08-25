import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { CategoryModel } from '../../core/model/category.model'
import { DefaultPrismaRepository } from '@src/shared/module/persistence/prisma/default.prisma.repository'

type QueryableFields = Prisma.$CategoryPayload['scalars']

@Injectable()
export class CategoryRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['category']

  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.category
  }

  async save(data: CategoryModel): Promise<void> {
    try {
      await this.model.create({ data })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async update(data: CategoryModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: data.id },
        data,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findOneBy(filter: Partial<QueryableFields>): Promise<CategoryModel | null> {
    try {
      const data = await this.model.findFirst({ where: filter })
      return data ? CategoryModel.createFrom(data) : null
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findManyBy(filter: Partial<QueryableFields>): Promise<CategoryModel[]> {
    try {
      const data = await this.model.findMany({ where: filter })
      return data.map(CategoryModel.createFrom)
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.model.update({ where: { id }, data: { deletedAt: new Date() } })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async clear(): Promise<void> {
    try {
      await this.model.deleteMany()
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }
}
