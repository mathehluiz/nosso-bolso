import { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import { UserModel } from '@src/organization/org-management/core/model/user.model'

export type GetUserReturnType = UserModel

export const GetUser = createParamDecorator<
  keyof GetUserReturnType | (keyof GetUserReturnType)[],
  ExecutionContext
>((_, ctx) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user as GetUserReturnType

  if (!user) {
    throw new Error('GetUser decorator : User not found')
  }

  return user
})
