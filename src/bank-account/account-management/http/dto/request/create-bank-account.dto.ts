import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CreateBankAccountDto } from '../../../core/service/account-management.service'

export class CreateBankAccountRequestDto
  implements Omit<CreateBankAccountDto, 'organizationId'>
{
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsNumber()
  balance: number

  @IsString()
  @IsNotEmpty()
  ownerId: string
}
