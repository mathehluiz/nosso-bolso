import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { MembershipManagementService } from '@src/organization/org-management/core/service/membership-management.service'
import { Request } from 'express'

interface CustomRequest extends Request {
  'x-org-id': string
}

@Injectable()
export class IsUserInOrg implements CanActivate {
  constructor(private membershipService: MembershipManagementService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest & { user: User }>()
    const reqUser = request.user
    const orgId = request.headers['x-org-id'] as string

    if (!reqUser) throw new ForbiddenException('No user found')

    if (!orgId) throw new ForbiddenException('No organization found')

    const member = await this.membershipService.getMembership(orgId, reqUser.id)

    if (member) return true

    return false
  }
}
