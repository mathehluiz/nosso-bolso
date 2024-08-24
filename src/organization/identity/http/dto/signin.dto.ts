import { IsNotEmpty, IsString } from 'class-validator'

export class SignInRequestDto {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
