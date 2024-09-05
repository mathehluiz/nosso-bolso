import { Expose } from 'class-transformer'
import { IsDateString, IsOptional } from 'class-validator'

export abstract class DefaultResponseDto {
  @IsDateString()
  @Expose()
  readonly createdAt: Date

  @IsDateString()
  @Expose()
  readonly updatedAt: Date

  @IsDateString()
  @Expose()
  @IsOptional()
  readonly deletedAt: Date | null

  @Expose()
  readonly id: string
}
