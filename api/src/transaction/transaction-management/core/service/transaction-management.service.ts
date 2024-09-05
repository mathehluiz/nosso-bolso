import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../persistence/repository/transaction.repository'
import { TransactionType } from '../enum/transaction-type.enum'
import { TransactionModel } from '../model/transaction.model'
import { TransactionNotFoundException } from '../exception/transaction-not-found.exception'
import { EventEmitterService } from '@src/shared/module/event/service/event-emitter.service'
import { TransactionManagementOperationType } from '@src/shared/events/transaction/transaction-management.event'
import { EntityChangedEvent } from '@src/shared/events/entity-changed.event'

export interface CreateTransactionDto {
  amount: number
  type: TransactionType
  createdById: string
  bankAccountId: string
  date?: Date
  note?: string
  paid?: boolean
  organizationId: string
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
  organizationId?: string
  paid?: boolean
  categoryId?: string
  recurringScheduleId?: string
}

@Injectable()
export class TransactionManagementService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async create(data: CreateTransactionDto): Promise<TransactionModel> {
    const transaction = TransactionModel.create(data)
    await this.transactionRepository.save(transaction)
    this.eventEmitter.emit(
      TransactionManagementOperationType.TRANSACTION_CREATED,
      new EntityChangedEvent(
        TransactionManagementOperationType.TRANSACTION_CREATED,
        transaction.id,
        transaction,
      ),
    )
    return transaction
  }

  async update(data: UpdateTransactionDto): Promise<TransactionModel> {
    const transaction = await this.findOneById(data.id)
    const updatedTransaction = TransactionModel.createFrom({ ...transaction, ...data })
    await this.transactionRepository.update(updatedTransaction)
    this.eventEmitter.emit(
      TransactionManagementOperationType.TRANSACTION_UPDATED,
      new EntityChangedEvent(
        TransactionManagementOperationType.TRANSACTION_UPDATED,
        updatedTransaction.id,
        {
          previous: transaction,
          current: updatedTransaction,
        },
      ),
    )
    return updatedTransaction
  }

  async delete(id: string): Promise<void> {
    const transaction = await this.findOneById(id)
    await this.transactionRepository.delete(id)
    this.eventEmitter.emit(
      TransactionManagementOperationType.TRANSACTION_UPDATED,
      new EntityChangedEvent(
        TransactionManagementOperationType.TRANSACTION_DELETED,
        id,
        transaction,
      ),
    )
  }

  async findOneById(id: string): Promise<TransactionModel> {
    const transaction = await this.transactionRepository.findOneBy({ id })
    if (!transaction) throw new TransactionNotFoundException('Transaction not found')
    return transaction
  }
}
