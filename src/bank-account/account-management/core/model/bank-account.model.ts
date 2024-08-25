import { DefaultModel, WithOptional } from '@src/shared/core/model/default.model'

export class BankAccountModel extends DefaultModel {
  name: string
  balance: number
  ownerId: string
  organizationId: string

  private constructor(data: BankAccountModel) {
    super()
    Object.assign(this, data)
  }

  static create(
    data: WithOptional<BankAccountModel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): BankAccountModel {
    return new BankAccountModel({
      ...data,
      id: data.id ? data.id : crypto.randomUUID(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
      deletedAt: data.deletedAt ? data.deletedAt : null,
    })
  }

  static createFrom(data: BankAccountModel): BankAccountModel {
    return new BankAccountModel(data)
  }
}
