import { UpdateGoalDto } from '@src/bank-account/goal/core/service/goal.service'
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateGoalRequestDto implements UpdateGoalDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  amount?: number

  @IsDateString()
  @IsOptional()
  dueDate?: Date
}
