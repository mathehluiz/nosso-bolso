import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { BankAccountModel } from '../../core/model/bank-account.model'
import { DefaultPrismaRepository } from '@src/shared/module/persistence/prisma/default.prisma.repository'

type QueryableFields = Prisma.$BankAccountPayload['scalars']

@Injectable()
export class BankAccountRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['bankAccount']

  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.bankAccount
  }

  async save(data: BankAccountModel): Promise<void> {
    try {
      await this.model.create({ data })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async update(data: BankAccountModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: data.id },
        data,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findOneBy(filter: Partial<QueryableFields>): Promise<BankAccountModel | null> {
    try {
      const data = await this.model.findFirst({ where: filter })
      return data ? BankAccountModel.createFrom(data) : null
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findManyBy(filter: Partial<QueryableFields>): Promise<BankAccountModel[]> {
    try {
      const data = await this.model.findMany({ where: filter })
      return data.map(BankAccountModel.createFrom)
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
