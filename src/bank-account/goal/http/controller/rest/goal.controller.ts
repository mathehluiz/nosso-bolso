import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { GoalService } from '@src/bank-account/goal/core/service/goal.service'
import { AuthResourceGuard } from '@src/shared/http/decorator/auth-resource.decorator'
import { CreateGoalRequestDto } from '../../dto/request/create-goal.dto'
import { GetOrg } from '@src/organization/identity/http/decorators/get-org.decorator'
import { DefaultOrganizationResponseDto } from '@src/organization/org-management/http/dto/response/default-organization-response.dto'
import { plainToInstance } from 'class-transformer'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'

@Controller({
  version: '1',
  path: 'goals',
})
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @AuthResourceGuard()
  @Post()
  async createGoal(
    @GetOrg() organizationId: string,
    @Body() goal: CreateGoalRequestDto,
  ): Promise<DefaultOrganizationResponseDto> {
    try {
      const created = await this.goalService.create({ ...goal, organizationId })
      return plainToInstance(DefaultOrganizationResponseDto, created, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @AuthResourceGuard()
  @Patch(':id')
  async updateGoal(
    @Param('id') id: string,
    @Body() goal: CreateGoalRequestDto,
  ): Promise<DefaultOrganizationResponseDto> {
    try {
      const updated = await this.goalService.update({ ...goal, id })
      return plainToInstance(DefaultOrganizationResponseDto, updated, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @AuthResourceGuard()
  @Delete(':id')
  async deleteGoal(@Param('id') id: string): Promise<void> {
    try {
      await this.goalService.delete(id)
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @AuthResourceGuard()
  @Get()
  async getGoals(
    @GetOrg() organizationId: string,
  ): Promise<DefaultOrganizationResponseDto[]> {
    try {
      const goals = await this.goalService.findByOrganization(organizationId)
      return goals.map((goal) =>
        plainToInstance(DefaultOrganizationResponseDto, goal, {
          excludeExtraneousValues: true,
        }),
      )
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
