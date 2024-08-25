import { DefaultModel, WithOptional } from '@src/shared/core/model/default.model'

export class CategoryModel extends DefaultModel {
  name: string
  color?: string
  organizationId: string
  description?: string | null

  private constructor(data: CategoryModel) {
    super()
    Object.assign(this, data)
  }

  static create(
    data: WithOptional<CategoryModel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): CategoryModel {
    return new CategoryModel({
      ...data,
      id: data.id ? data.id : crypto.randomUUID(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
      deletedAt: data.deletedAt ? data.deletedAt : null,
    })
  }

  static createFrom(data: CategoryModel): CategoryModel {
    return new CategoryModel(data)
  }
}
