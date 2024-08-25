import { TransactionType } from '@src/transaction/transaction-management/core/enum/transaction-type.enum'
import { CreateTransactionDto } from '@src/transaction/transaction-management/core/service/transaction-management.service'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class CreateTransactionRequestDto
  implements Omit<CreateTransactionDto, 'createdById'>
{
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @IsDateString()
  @IsOptional()
  date?: Date

  @IsString()
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType

  @IsNotEmpty()
  @IsUUID(4)
  bankAccountId: string

  @IsOptional()
  @IsString()
  note?: string

  @IsBoolean()
  @IsOptional()
  paid?: boolean

  @IsOptional()
  @IsUUID(4)
  categoryId?: string

  @IsOptional()
  @IsUUID(4)
  recurringScheduleId?: string
}
