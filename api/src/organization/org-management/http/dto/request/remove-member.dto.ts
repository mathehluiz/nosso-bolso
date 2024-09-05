import { IsNotEmpty, IsString } from 'class-validator'

export class RemoveMemberRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string
}
