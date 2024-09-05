import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DefaultPrismaRepository } from '@src/shared/module/persistence/prisma/default.prisma.repository'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { MembershipModel } from '../../core/model/membership.model'

type QueryableFields = Prisma.$MemberPayload['scalars']

@Injectable()
export class MembershipRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['member']

  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.member
  }

  async save(model: MembershipModel): Promise<void> {
    try {
      await this.model.create({
        data: model,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async remove(model: MembershipModel): Promise<void> {
    try {
      await this.model.delete({
        where: { id: model.id },
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async update(model: MembershipModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: model.id },
        data: model,
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findOneBy(query: Partial<QueryableFields>): Promise<MembershipModel | undefined> {
    try {
      const membership = await this.model.findFirst({
        where: query,
      })
      if (!membership) return

      return MembershipModel.createFrom(membership as MembershipModel)
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findManyBy(query: Partial<QueryableFields>) {
    try {
      const memberships = await this.model.findMany({
        where: query,
        include: {
          user: true,
        },
      })

      return memberships.map((membership) => {
        // @ts-expect-error - password is not in the type
        delete membership.user.password
        return membership
      })

      return memberships
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async clear(): Promise<void> {
    try {
      await this.model.deleteMany({})
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }
}
