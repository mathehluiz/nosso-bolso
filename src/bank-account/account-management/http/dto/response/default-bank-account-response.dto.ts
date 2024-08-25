import { DefaultResponseDto } from '@src/shared/http/dto/default-response.dto'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class DefaultBankAccountResponseDto extends DefaultResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  balance: number

  @Expose()
  @IsString()
  @IsNotEmpty()
  ownerId: string
}
