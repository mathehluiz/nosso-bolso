import { Controller, Get, Query } from '@nestjs/common'
import { GetOrg } from '@src/organization/identity/http/decorators/get-org.decorator'
import { TransactionReportService } from '../../core/service/transaction-report.service'
import { AuthResourceGuard } from '@src/shared/http/decorator/auth-resource.decorator'

@Controller({
  version: '1',
  path: 'transaction-report',
})
export class TransactionReportController {
  constructor(private readonly transactionReportService: TransactionReportService) {}

  @AuthResourceGuard()
  @Get('month-transactions')
  async getMonthTransactions(
    @Query('date') date: string,
    @GetOrg() organizationId: string,
  ) {
    return this.transactionReportService.getMonthTransactions(date, organizationId)
  }

  @AuthResourceGuard()
  @Get('period-transactions')
  async getPeriodTransactions(
    @Query('from') from: string,
    @Query('to') to: string,
    @GetOrg() organizationId: string,
  ) {
    return this.transactionReportService.getPeriodTransactions(from, to, organizationId)
  }
}
