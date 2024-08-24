import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserModel } from '@src/organization/org-management/core/model/user.model'
import { UserManagementService } from '@src/organization/org-management/core/service/user-management.service'
import { ConfigService } from '@src/shared/module/config/config.service'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user: UserModel
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await this.getRequest(context)
    const token = this.extractTokenFromHeader(request)
    if (!token) throw new UnauthorizedException()
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.secret'),
      })

      const user = await this.userManagementService.getUserById(payload.sub)
      if (!user) throw new UnauthorizedException()
      request.user = user
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private async getRequest(context: ExecutionContext): Promise<AuthenticatedRequest> {
    try {
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

      return req
    } catch {
      throw new UnauthorizedException()
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.get('Authorization')?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
