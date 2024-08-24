import { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

export type GetOrgReturnType = string

export const GetOrg = createParamDecorator<
  keyof GetOrgReturnType | (keyof GetOrgReturnType)[],
  ExecutionContext
>((_, ctx) => {
  const request = ctx.switchToHttp().getRequest()
  const organization = request.headers['x-org-id']

  if (!organization) {
    throw new Error('GetOrg decorator : Org not found')
  }

  return organization
})
