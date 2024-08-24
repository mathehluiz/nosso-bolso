import { DefaultModel, WithOptional } from '@src/shared/core/model/default.model'

export class OrganizationModel extends DefaultModel {
  name: string
  slug: string
  ownerId: string

  private constructor(data: OrganizationModel) {
    super()
    Object.assign(this, data)
  }

  static create(
    data: WithOptional<
      OrganizationModel,
      'id' | 'slug' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): OrganizationModel {
    return new OrganizationModel({
      ...data,
      id: data.id ? data.id : crypto.randomUUID(),
      slug: OrganizationModel.slugify(data.name),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
      deletedAt: data.deletedAt ? data.deletedAt : null,
    })
  }

  static createFrom(data: OrganizationModel): OrganizationModel {
    return new OrganizationModel(data)
  }

  private static slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }
}
