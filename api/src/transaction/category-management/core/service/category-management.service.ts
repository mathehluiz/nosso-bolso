import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../../persistence/repository/category.repository'
import { CategoryModel } from '../model/category.model'
import { CategoryNotFoundException } from '../exception/category-not-found.exception'

export interface CreateCategoryDto {
  name: string
  organizationId: string
  color?: string
  description?: string
}

export interface UpdateCategoryDto {
  id: string
  name?: string
  color?: string
  description?: string
}

@Injectable()
export class CategoryManagementService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(data: CreateCategoryDto): Promise<CategoryModel> {
    const category = CategoryModel.create(data)
    await this.categoryRepository.save(category)
    return category
  }

  async update(data: UpdateCategoryDto): Promise<CategoryModel> {
    const category = await this.categoryRepository.findOneBy({ id: data.id })
    if (!category) throw new CategoryNotFoundException('Category not found')
    const updatedCategory = CategoryModel.create({ ...category, ...data })
    await this.categoryRepository.update(updatedCategory)
    return updatedCategory
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) throw new CategoryNotFoundException('Category not found')
    await this.categoryRepository.delete(id)
  }

  async findByOrganization(organizationId: string): Promise<CategoryModel[]> {
    return this.categoryRepository.findManyBy({ organizationId: organizationId })
  }
}
