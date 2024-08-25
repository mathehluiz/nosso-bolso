import { DefaultResponseDto } from '@src/shared/http/dto/default-response.dto'
import { Expose } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class DefaultGoalResponseDto extends DefaultResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @Expose()
  @IsString()
  @IsNotEmpty()
  bankAccountId: string

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date
}
