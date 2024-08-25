import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DefaultPrismaRepository } from '@src/shared/module/persistence/prisma/default.prisma.repository'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { TransactionModel } from '../../core/model/transaction.model'

type QueryableFields = Prisma.$TransactionPayload['scalars']

@Injectable()
export class TransactionRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['transaction']

  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.transaction
  }

  async save(data: TransactionModel): Promise<void> {
    try {
      await this.model.create({ data })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async update(data: TransactionModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: data.id },
        data,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findOneBy(filter: Partial<QueryableFields>): Promise<TransactionModel | null> {
    try {
      const data = await this.model.findFirst({ where: filter })
      return data ? TransactionModel.createFrom(data) : null
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
