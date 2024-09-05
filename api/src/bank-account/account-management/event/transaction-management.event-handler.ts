import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EntityChangedEvent } from '@src/shared/events/entity-changed.event'
import { TransactionModel } from '@src/transaction/transaction-management/core/model/transaction.model'
import { AccountManagementService } from '../core/service/account-management.service'

@Injectable()
export class TransactionManagementEventHandler {
  constructor(private readonly accountManagementService: AccountManagementService) {}
  @OnEvent('transaction.created')
  @OnEvent('transaction.updated')
  @OnEvent('transaction.deleted')
  async handlerContentCreatedEvent(
    payload: EntityChangedEvent<
      TransactionModel & { previous: TransactionModel; current: TransactionModel }
    >,
  ) {
    switch (payload.operationType) {
      case 'transaction.created':
        if (payload.entityData.type === 'INCOME') {
          await this.accountManagementService.updateBalance(
            payload.entityData.bankAccountId,
            payload.entityData.amount,
          )
          return
        }
        await this.accountManagementService.updateBalance(
          payload.entityData.bankAccountId,
          -payload.entityData.amount,
        )
        break
      case 'transaction.updated':
        const oldTransaction = payload.entityData.previous
        const newTransaction = payload.entityData.current
        if (oldTransaction.bankAccountId !== newTransaction.bankAccountId) {
          if (oldTransaction.type === 'INCOME') {
            await this.accountManagementService.updateBalance(
              oldTransaction.bankAccountId,
              -oldTransaction.amount,
            )
            await this.accountManagementService.updateBalance(
              newTransaction.bankAccountId,
              newTransaction.amount,
            )
          } else {
            await this.accountManagementService.updateBalance(
              oldTransaction.bankAccountId,
              oldTransaction.amount,
            )
            await this.accountManagementService.updateBalance(
              newTransaction.bankAccountId,
              -newTransaction.amount,
            )
          }

          return
        }
        if (newTransaction.amount !== oldTransaction.amount) {
          if (newTransaction.type === 'INCOME') {
            await this.accountManagementService.updateBalance(
              newTransaction.bankAccountId,
              newTransaction.amount - oldTransaction.amount,
            )
          } else {
            await this.accountManagementService.updateBalance(
              newTransaction.bankAccountId,
              oldTransaction.amount - newTransaction.amount,
            )
          }
        }
        break
      case 'transaction.deleted':
        if (payload.entityData.type === 'INCOME') {
          await this.accountManagementService.updateBalance(
            payload.entityData.bankAccountId,
            -payload.entityData.amount,
          )
          return
        }
        await this.accountManagementService.updateBalance(
          payload.entityData.bankAccountId,
          payload.entityData.amount,
        )
        break
    }
  }
}
