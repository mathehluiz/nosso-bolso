import { UpdateBankAccountDto } from '@src/bank-account/account-management/core/service/account-management.service'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateBankAccountRequestDto implements Omit<UpdateBankAccountDto, 'id'> {
  @IsString()
  @IsOptional()
  name?: string

  @IsOptional()
  @IsNumber()
  balance?: number
}
