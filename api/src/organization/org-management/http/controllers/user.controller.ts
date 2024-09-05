import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  // Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { UserManagementService } from '../../core/service/user-management.service'
import { DefaultUserResponseDto } from '../dto/response/default-user-response.dto'
import { CreateUserRequestDto } from '../dto/request/create-user.dto'
import { plainToInstance } from 'class-transformer'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'
import { ConflictDomainException } from '@src/shared/core/exception/conflict-domain.exection'
import { GetUser } from '@src/organization/identity/http/decorators/get-user.decorator'
import { AuthGuard } from '@src/organization/identity/http/guard/auth.guard'
// import { UpdateUserRequestDto } from '../dto/request/update-user.dto';
// import { ChangePasswordRequestDto } from '../dto/request/change-password.dto';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post()
  async createUser(@Body() dto: CreateUserRequestDto): Promise<DefaultUserResponseDto> {
    try {
      const user = await this.userManagementService.create(dto)
      return plainToInstance(DefaultUserResponseDto, user, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      if (error instanceof ConflictDomainException) {
        throw new ConflictException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@GetUser() user: DefaultUserResponseDto) {
    try {
      const response = await this.userManagementService.getMe(user.id)
      return response
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      if (error instanceof ConflictDomainException) {
        throw new ConflictException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }
}
