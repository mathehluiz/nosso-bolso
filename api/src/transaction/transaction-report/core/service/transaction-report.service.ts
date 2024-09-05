import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '@src/transaction/transaction-management/persistence/repository/transaction.repository'
import dayjs from 'dayjs'

@Injectable()
export class TransactionReportService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getMonthTransactions(date: string, organizationId: string) {
    return this.transactionRepository.findManyBy({
      organizationId,
      date: {
        // @ts-expect-error date errors
        gte: dayjs(date).startOf('month').toDate(),
        lte: dayjs(date).endOf('month').toDate(),
      },
      deletedAt: null,
    })
  }

  async getPeriodTransactions(from: string, to: string, organizationId: string) {
    return this.transactionRepository.findManyBy({
      organizationId,
      date: {
        // @ts-expect-error date errors
        gte: dayjs(from).startOf('day').toDate(),
        lte: dayjs(to).endOf('day').toDate(),
      },
      deletedAt: null,
    })
  }
}
