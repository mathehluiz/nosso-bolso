import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@src/organization/identity/http/guard/auth.guard'
import { TransactionManagementService } from '@src/transaction/transaction-management/core/service/transaction-management.service'
import { CreateTransactionRequestDto } from '../../dto/request/create-transaction.dto'
import { DefaultTransactionResponseDto } from '../../dto/response/defautl-transaction-response.dto'
import { plainToInstance } from 'class-transformer'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'
import { GetUser } from '@src/organization/identity/http/decorators/get-user.decorator'
import { UpdateTransactionRequestDto } from '../../dto/request/update-transaction.dto'
import { IsUserInOrg } from '@src/organization/identity/http/guard/is-user-in-org.guard'

@Controller({
  version: '1',
  path: 'transactions',
})
export class TransactionController {
  constructor(
    private readonly transactionManagementService: TransactionManagementService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, IsUserInOrg)
  async createTransaction(
    @GetUser() user: any,
    @Body() createTransactionRequest: CreateTransactionRequestDto,
  ): Promise<DefaultTransactionResponseDto> {
    try {
      const transaction = await this.transactionManagementService.create({
        createdById: user.id,
        ...createTransactionRequest,
      })
      return plainToInstance(DefaultTransactionResponseDto, transaction, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard, IsUserInOrg)
  async updateTransaction(
    @Param('id') id: string,
    @Body()
    updateTransactionRequest: UpdateTransactionRequestDto,
  ): Promise<DefaultTransactionResponseDto> {
    try {
      const transaction = await this.transactionManagementService.update({
        id,
        ...updateTransactionRequest,
      })
      return plainToInstance(DefaultTransactionResponseDto, transaction, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, IsUserInOrg)
  async getTransactionById(
    @Param('id') id: string,
  ): Promise<DefaultTransactionResponseDto> {
    try {
      const transaction = await this.transactionManagementService.findOneById(id)
      return plainToInstance(DefaultTransactionResponseDto, transaction, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, IsUserInOrg)
  async deleteTransaction(@Param('id') id: string): Promise<void> {
    try {
      await this.transactionManagementService.delete(id)
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }
}
