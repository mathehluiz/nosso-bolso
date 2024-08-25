import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from '@src/organization/identity/http/guard/auth.guard'
import { IsUserInOrg } from '@src/organization/identity/http/guard/is-user-in-org.guard'

export function AuthResourceGuard() {
  return applyDecorators(
    UseGuards(AuthGuard, IsUserInOrg),
    //TODO: Implement documentation for this decorator
    // ApiSecurity(ADMIN_SECURITY.name),
    // ApiHeader({
    //   name: REQUEST_HEADER_API_KEY,
    //   required: true
    // })
  )
}
