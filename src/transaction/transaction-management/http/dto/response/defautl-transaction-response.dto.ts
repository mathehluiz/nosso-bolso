import { TransactionType } from '@prisma/client'
import { DefaultResponseDto } from '@src/shared/http/dto/default-response.dto'
import { Expose } from 'class-transformer'
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

export class DefaultTransactionResponseDto extends DefaultResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @Expose()
  @IsNotEmpty()
  @IsDateString()
  date: Date

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType

  @Expose()
  @IsNotEmpty()
  @IsUUID(4)
  createdById: string

  @Expose()
  @IsNotEmpty()
  @IsUUID(4)
  bankAccountId: string

  @Expose()
  @IsString()
  @IsOptional()
  note?: string

  @Expose()
  @IsOptional()
  @IsBoolean()
  paid?: boolean

  @Expose()
  @IsOptional()
  @IsUUID(4)
  categoryId?: string

  @Expose()
  @IsOptional()
  @IsUUID(4)
  recurringScheduleId?: string
}
