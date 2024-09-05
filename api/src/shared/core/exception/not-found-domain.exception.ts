import { DomainException } from '@src/shared/core/exception/domain.exception'

export class NotFoundDomainException extends DomainException {
  constructor(message: string) {
    super(message)
  }
}
