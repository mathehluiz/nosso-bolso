import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRepository } from '@src/organization/org-management/persistence/repository/user.repository'
import { compare } from 'bcrypt'
import { UserUnauthorizedException } from '../exception/user-unauthorized.exception'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email })
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UserUnauthorizedException(`Cannot authorize user: ${email}`)
    }
    //TODO: add more fields to the JWT
    const payload = { sub: user.id }
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        // Using HS256 algorithm to prenvent from security risk
        // https://book.hacktricks.xyz/pentesting-web/hacking-jwt-json-web-tokens#modify-the-algorithm-to-none-cve-2015-9235
        algorithm: 'HS256',
      }),
    }
  }
  private async comparePassword(
    password: string,
    actualPassword: string,
  ): Promise<boolean> {
    return compare(password, actualPassword)
  }
}
