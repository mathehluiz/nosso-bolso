import { DomainException } from '@src/shared/core/exception/domain.exception'

export class ConflictDomainException extends DomainException {
  constructor(message: string) {
    super(message)
  }
}
