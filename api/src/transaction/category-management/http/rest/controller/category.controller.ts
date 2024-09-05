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
import { GetOrg } from '@src/organization/identity/http/decorators/get-org.decorator'
import { AuthResourceGuard } from '@src/shared/http/decorator/auth-resource.decorator'
import { DefaultCategoryResponseDto } from '../../dto/response/default-category-response.dto'
import { plainToInstance } from 'class-transformer'
import { CreateCategoryRequestDto } from '../../dto/request/create-category.dto'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'
import { UpdateCategoryRequestDto } from '../../dto/request/update-category.dto'
import { CategoryManagementService } from '@src/transaction/category-management/core/service/category-management.service'

@Controller({
  version: '1',
  path: 'categories',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryManagementService) {}

  @Post()
  @AuthResourceGuard()
  async create(
    @GetOrg() organizationId: string,
    @Body() data: CreateCategoryRequestDto,
  ): Promise<DefaultCategoryResponseDto> {
    try {
      const category = await this.categoryService.create({ ...data, organizationId })
      return plainToInstance(DefaultCategoryResponseDto, category, {
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
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryRequestDto,
  ): Promise<DefaultCategoryResponseDto> {
    try {
      const category = await this.categoryService.update({ ...data, id })
      return plainToInstance(DefaultCategoryResponseDto, category, {
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
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.categoryService.delete(id)
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }

  @AuthResourceGuard()
  @Get()
  async findByOrganization(
    @GetOrg() organizationId: string,
  ): Promise<DefaultCategoryResponseDto[]> {
    try {
      const categories = await this.categoryService.findByOrganization(organizationId)
      return categories.map((category) =>
        plainToInstance(DefaultCategoryResponseDto, category, {
          excludeExtraneousValues: true,
        }),
      )
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
