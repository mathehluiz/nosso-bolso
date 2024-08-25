import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../persistence/repository/transaction.repository'
import { TransactionType } from '../enum/transaction-type.enum'
import { TransactionModel } from '../model/transaction.model'
import { TransactionNotFoundException } from '../exception/transaction-not-found.exception'

export interface CreateTransactionDto {
  amount: number
  type: TransactionType
  createdById: string
  bankAccountId: string
  date?: Date
  note?: string
  paid?: boolean
  categoryId?: string
  recurringScheduleId?: string
}

export interface UpdateTransactionDto {
  id: string
  amount?: number
  date?: Date
  type?: TransactionType
  createdById?: string
  bankAccountId?: string
  note?: string
  paid?: boolean
  categoryId?: string
  recurringScheduleId?: string
}

@Injectable()
export class TransactionManagementService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(data: CreateTransactionDto): Promise<TransactionModel> {
    const transaction = TransactionModel.create(data)
    await this.transactionRepository.save(transaction)
    return transaction
  }

  async update(data: UpdateTransactionDto): Promise<TransactionModel> {
    const transaction = await this.findOneById(data.id)
    const updatedTransaction = TransactionModel.createFrom({ ...transaction, ...data })
    await this.transactionRepository.update(updatedTransaction)
    return updatedTransaction
  }

  async delete(id: string): Promise<void> {
    await this.findOneById(id)
    await this.transactionRepository.delete(id)
  }

  async findOneById(id: string): Promise<TransactionModel> {
    const transaction = await this.transactionRepository.findOneBy({ id })
    if (!transaction) throw new TransactionNotFoundException('Transaction not found')
    return transaction
  }
}
