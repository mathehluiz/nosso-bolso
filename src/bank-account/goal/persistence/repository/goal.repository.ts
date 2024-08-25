import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { GoalModel } from '../../core/model/goal.model'
import { DefaultPrismaRepository } from '@src/shared/module/persistence/prisma/default.prisma.repository'

type QueryableFields = Prisma.$GoalPayload['scalars']

@Injectable()
export class GoalRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['goal']

  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.goal
  }

  async save(data: GoalModel): Promise<void> {
    try {
      await this.model.create({ data })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async update(data: GoalModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: data.id },
        data,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findOneBy(filter: Partial<QueryableFields>): Promise<GoalModel | null> {
    try {
      const data = await this.model.findFirst({ where: filter })
      return data ? GoalModel.createFrom(data) : null
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findManyBy(filter: Partial<QueryableFields>): Promise<GoalModel[]> {
    try {
      const data = await this.model.findMany({ where: filter })
      return data.map(GoalModel.createFrom)
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
