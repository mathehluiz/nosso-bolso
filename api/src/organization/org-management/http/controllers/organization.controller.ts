import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { OrganizationManagementService } from '../../core/service/org-management.service'
import { MembershipManagementService } from '../../core/service/membership-management.service'
import { plainToInstance } from 'class-transformer'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'
import { ConflictDomainException } from '@src/shared/core/exception/conflict-domain.exection'
import { CreateOrganizationRequestDto } from '../dto/request/create-organization.dto'
import { DefaultOrganizationResponseDto } from '../dto/response/default-organization-response.dto'
import { InviteMemberRequestDto } from '../dto/request/invite-member.dto'
import { RemoveMemberRequestDto } from '../dto/request/remove-member.dto'
import { AuthGuard } from '@src/organization/identity/http/guard/auth.guard'
import { IsUserInOrg } from '@src/organization/identity/http/guard/is-user-in-org.guard'
import { GetOrg } from '@src/organization/identity/http/decorators/get-org.decorator'

@Controller({
  version: '1',
  path: 'organization',
})
export class OrganizationController {
  constructor(
    private readonly orgService: OrganizationManagementService,
    private readonly memberService: MembershipManagementService,
  ) {}

  @Post()
  async createOrganization(
    @Body() dto: CreateOrganizationRequestDto,
  ): Promise<DefaultOrganizationResponseDto> {
    try {
      const org = await this.orgService.create(dto)
      return plainToInstance(DefaultOrganizationResponseDto, org, {
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

  @Get()
  @UseGuards(AuthGuard, IsUserInOrg)
  async getOrganization(
    @GetOrg() orgId: string,
  ): Promise<DefaultOrganizationResponseDto> {
    try {
      const org = await this.orgService.getOneById(orgId)
      return plainToInstance(DefaultOrganizationResponseDto, org, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @HttpCode(204)
  @UseGuards(AuthGuard, IsUserInOrg)
  @Post('shutdown')
  async shutdownOrganization(@GetOrg() id: string): Promise<void> {
    try {
      await this.orgService.shutdown(id)
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @UseGuards(AuthGuard, IsUserInOrg)
  @Post('invite')
  async inviteMember(
    @GetOrg() id: string,
    @Body() dto: InviteMemberRequestDto,
  ): Promise<void> {
    try {
      await this.memberService.create({ organizationId: id, ...dto })
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

  @UseGuards(AuthGuard, IsUserInOrg)
  @Get('members')
  async getMembers(@GetOrg() id: string) {
    try {
      return await this.memberService.getMembers(id)
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @HttpCode(200)
  @UseGuards(AuthGuard, IsUserInOrg)
  @Post('remove-member')
  async removeMember(
    @GetOrg() id: string,
    @Body() dto: RemoveMemberRequestDto,
  ): Promise<void> {
    try {
      await this.memberService.remove(id, dto.userId)
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }
}
