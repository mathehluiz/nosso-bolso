import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'

export class OrganizationNotFoundException extends NotFoundDomainException {
  constructor(message = 'Organization not found') {
    super(message)
  }
}
