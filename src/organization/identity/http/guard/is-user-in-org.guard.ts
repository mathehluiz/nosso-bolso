import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { MembershipRepository } from '@src/organization/org-management/persistence/repository/membership.repository'
import { Request } from 'express'

interface CustomRequest extends Request {
  'x-org-id': string
}

@Injectable()
export class IsUserInOrg implements CanActivate {
  constructor(private membershipRepository: MembershipRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest & { user: User }>()
    const reqUser = request.user
    const orgId = request.headers['x-org-id'] as string

    if (!reqUser) throw new ForbiddenException('No user found')

    if (!orgId) throw new ForbiddenException('No organization found')

    const user = await this.membershipRepository.findOneBy({
      userId: reqUser.id,
      organizationId: orgId,
    })

    if (user) return true

    return false
  }
}
