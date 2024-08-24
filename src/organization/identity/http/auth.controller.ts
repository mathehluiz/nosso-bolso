import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../core/service/authentication.service'
import { SignInRequestDto } from './dto/signin.dto'

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: SignInRequestDto) {
    const { email, password } = dto
    try {
      const token = await this.authService.signIn(email, password)
      return token
    } catch (error) {
      throw new UnauthorizedException('Cannot authorize user')
    }
  }
}
