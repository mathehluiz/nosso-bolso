import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DefaultPrismaRepository } from '@src/shared/module/persistence/prisma/default.prisma.repository'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { UserModel } from '../../core/model/user.model'

type QueryableFields = Prisma.$UserPayload['scalars']

@Injectable()
export class UserRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['user']

  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.user
  }

  async save(model: UserModel): Promise<void> {
    try {
      await this.model.create({
        data: model,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async update(model: UserModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: model.id },
        data: model,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findOneBy(query: Partial<QueryableFields>): Promise<UserModel | undefined> {
    try {
      const user = await this.model.findFirst({
        where: query,
      })
      if (!user) return

      return UserModel.createFrom(user as UserModel)
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
