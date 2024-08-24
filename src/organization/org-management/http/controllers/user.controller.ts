import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  // Patch,
  Post,
} from '@nestjs/common'
import { UserManagementService } from '../../core/service/user-management.service'
import { DefaultUserResponseDto } from '../dto/response/default-user-response.dto'
import { CreateUserRequestDto } from '../dto/request/create-user.dto'
import { plainToInstance } from 'class-transformer'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'
import { ConflictDomainException } from '@src/shared/core/exception/conflict-domain.exection'
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

  //   @Get('me')
  //   async getMe(): Promise<DefaultUserResponseDto> {
  //     try {
  //       const user = await this.userManagementService.getMe();
  //       return plainToInstance(DefaultUserResponseDto, user, {
  //         excludeExtraneousValues: true,
  //       });
  //     } catch (error) {
  //       if (error instanceof NotFoundDomainException) {
  //         throw new NotFoundException(error.message);
  //       }

  //       if (error instanceof ConflictDomainException) {
  //         throw new ConflictException(error.message);
  //       }

  //       throw new InternalServerErrorException();
  //     }
  //   }

  // @Patch()
  // async updateUser(@Body() dto: UpdateUserRequestDto): Promise<DefaultUserResponseDto> {
  //   try {
  //     const user = await this.userManagementService.update({ ...dto, id: '1' });
  //     return plainToInstance(DefaultUserResponseDto, user, {
  //       excludeExtraneousValues: true,
  //     });
  //   } catch (error) {
  //     if (error instanceof NotFoundDomainException) {
  //       throw new NotFoundException(error.message);
  //     }

  //     if (error instanceof ConflictDomainException) {
  //       throw new ConflictException(error.message);
  //     }

  //     throw new InternalServerErrorException();
  //   }
  // }

  // @Post('change-password')
  // async changePassword(@Body() dto: ChangePasswordRequestDto): Promise<void> {
  //   try {
  //     await this.userManagementService.changePassword({ userId: '1', ...dto });
  //   } catch (error) {
  //     if (error instanceof NotFoundDomainException) {
  //       throw new NotFoundException(error.message);
  //     }

  //     throw new InternalServerErrorException();
  //   }
  // }
}
