import { DefaultModel, WithOptional } from '@src/shared/core/model/default.model'
import { Role } from '../enum/role.enum'

export class MembershipModel extends DefaultModel {
  userId: string
  organizationId: string
  role: Role

  private constructor(data: MembershipModel) {
    super()
    Object.assign(this, data)
  }

  static create(
    data: WithOptional<MembershipModel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): MembershipModel {
    return new MembershipModel({
      ...data,
      id: data.id ? data.id : crypto.randomUUID(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
      deletedAt: data.deletedAt ? data.deletedAt : null,
    })
  }

  static createFrom(data: MembershipModel): MembershipModel {
    return new MembershipModel(data)
  }
}
