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
} from '@nestjs/common'
import { AccountManagementService } from '@src/bank-account/account-management/core/service/account-management.service'
import { AuthResourceGuard } from '@src/shared/http/decorator/auth-resource.decorator'
import { CreateBankAccountRequestDto } from '../../dto/request/create-bank-account.dto'
import { DefaultBankAccountResponseDto } from '../../dto/response/default-bank-account-response.dto'
import { plainToInstance } from 'class-transformer'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'
import { UpdateBankAccountRequestDto } from '../../dto/request/update-bank-account.dto'
import { GetOrg } from '@src/organization/identity/http/decorators/get-org.decorator'

@Controller({
  version: '1',
  path: 'bank-accounts',
})
export class AccountManagementController {
  constructor(private readonly accountManagementService: AccountManagementService) {}

  @AuthResourceGuard()
  @Post()
  async create(
    @GetOrg() organizationId: string,
    @Body() bankAccount: CreateBankAccountRequestDto,
  ): Promise<DefaultBankAccountResponseDto> {
    try {
      const created = await this.accountManagementService.create({
        ...bankAccount,
        organizationId,
      })
      return plainToInstance(DefaultBankAccountResponseDto, created, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @AuthResourceGuard()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountRequestDto,
  ): Promise<DefaultBankAccountResponseDto> {
    try {
      const updated = await this.accountManagementService.update({
        id,
        ...updateBankAccountDto,
      })
      return plainToInstance(DefaultBankAccountResponseDto, updated, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @AuthResourceGuard()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.accountManagementService.delete(id)
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @AuthResourceGuard()
  @Get()
  async getByOrganization(
    @GetOrg() organizationId: string,
  ): Promise<DefaultBankAccountResponseDto[]> {
    try {
      const bankAccounts =
        await this.accountManagementService.getByOrganization(organizationId)
      return bankAccounts.map((bankAccount) =>
        plainToInstance(DefaultBankAccountResponseDto, bankAccount, {
          excludeExtraneousValues: true,
        }),
      )
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
