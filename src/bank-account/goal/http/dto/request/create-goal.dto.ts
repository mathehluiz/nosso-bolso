import { CreateGoalDto } from '@src/bank-account/goal/core/service/goal.service'
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateGoalRequestDto implements Omit<CreateGoalDto, 'organizationId'> {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  amount: number

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date

  @IsString()
  @IsNotEmpty()
  bankAccountId: string
}
