import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DefaultPrismaRepository } from '@src/shared/module/persistence/prisma/default.prisma.repository'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { OrganizationModel } from '../../core/model/organization.model'

type QueryableFields = Prisma.$OrganizationPayload['scalars']

@Injectable()
export class OrganizationRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['organization']

  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.organization
  }

  async save(model: OrganizationModel): Promise<void> {
    try {
      await this.model.create({
        data: {
          id: model.id,
          name: model.name,
          slug: model.slug,
          ownerId: model.ownerId,
          members: {
            create: {
              userId: model.ownerId,
              role: 'OWNER',
            },
          },
        },
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async remove(model: OrganizationModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: model.id },
        data: { deletedAt: new Date() },
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async update(model: OrganizationModel): Promise<void> {
    try {
      await this.model.update({
        where: { id: model.id },
        data: {
          name: model.name,
          slug: model.slug,
        },
      })
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async findOneBy(
    query: Partial<QueryableFields>,
  ): Promise<OrganizationModel | undefined> {
    try {
      const org = await this.model.findFirst({
        where: query,
      })
      if (!org) return

      return OrganizationModel.createFrom(org)
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  async clear(): Promise<{ count: number }> {
    try {
      return await this.model.deleteMany()
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }
}
