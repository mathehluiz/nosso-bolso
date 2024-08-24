import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  PersistenceClientException,
  PersistenceInternalException,
} from '@src/shared/core/exception/storage.exception'

@Injectable()
export abstract class DefaultPrismaRepository {
  protected handleAndThrowError(error: unknown): never {
    const errorMessage = this.extractErrorMessage(error)
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new PersistenceClientException(error.message)
    }

    throw new PersistenceInternalException(errorMessage)
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message
    }
    return 'An unexpected error occurred.'
  }
}
