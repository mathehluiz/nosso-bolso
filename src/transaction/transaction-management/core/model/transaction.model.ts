import { TransactionType } from '@prisma/client'
import { DefaultModel, WithOptional } from '@src/shared/core/model/default.model'

export class TransactionModel extends DefaultModel {
  amount: number
  date: Date
  type: TransactionType
  createdById: string
  bankAccountId: string
  note?: string | null
  paid?: boolean
  categoryId?: string | null
  recurringScheduleId?: string | null

  private constructor(data: TransactionModel) {
    super()
    Object.assign(this, data)
  }

  static create(
    data: WithOptional<
      TransactionModel,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'date'
    >,
  ): TransactionModel {
    return new TransactionModel({
      ...data,
      id: data.id ? data.id : crypto.randomUUID(),
      paid: data.paid ? data.paid : false,
      type: data.type ? data.type : TransactionType.EXPENSE,
      date: data.date ? data.date : new Date(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
      deletedAt: data.deletedAt ? data.deletedAt : null,
    })
  }

  static createFrom(data: TransactionModel): TransactionModel {
    return new TransactionModel(data)
  }
}
