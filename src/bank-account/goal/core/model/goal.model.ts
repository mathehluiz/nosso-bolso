import { DefaultModel, WithOptional } from '@src/shared/core/model/default.model'

export class GoalModel extends DefaultModel {
  name: string
  amount: number
  bankAccountId: string
  dueDate: Date

  private constructor(data: GoalModel) {
    super()
    Object.assign(this, data)
  }

  static create(
    data: WithOptional<GoalModel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): GoalModel {
    return new GoalModel({
      ...data,
      id: data.id ? data.id : crypto.randomUUID(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
      deletedAt: data.deletedAt ? data.deletedAt : null,
    })
  }

  static createFrom(data: GoalModel): GoalModel {
    return new GoalModel(data)
  }
}
