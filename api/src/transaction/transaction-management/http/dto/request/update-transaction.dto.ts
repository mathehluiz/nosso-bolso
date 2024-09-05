import { TransactionType } from '@src/transaction/transaction-management/core/enum/transaction-type.enum'
import { UpdateTransactionDto } from '@src/transaction/transaction-management/core/service/transaction-management.service'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class UpdateTransactionRequestDto implements Omit<UpdateTransactionDto, 'id'> {
  @IsNumber()
  @IsOptional()
  amount?: number

  @IsDateString()
  @IsOptional()
  date?: Date

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType

  @IsOptional()
  @IsUUID(4)
  bankAccountId?: string

  @IsOptional()
  @IsString()
  note?: string

  @IsOptional()
  @IsBoolean()
  paid?: boolean

  @IsOptional()
  @IsUUID(4)
  categoryId?: string

  @IsOptional()
  @IsUUID(4)
  recurringScheduleId?: string
}
