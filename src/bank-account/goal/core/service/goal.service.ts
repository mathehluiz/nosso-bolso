import { Injectable } from '@nestjs/common'
import { GoalRepository } from '../../persistence/repository/goal.repository'
import { GoalModel } from '../model/goal.model'
import { GoalNotFoundException } from '../exception/goal-not-found.exception'

export interface CreateGoalDto {
  name: string
  amount: number
  dueDate: Date
  bankAccountId: string
  organizationId: string
}

export interface UpdateGoalDto {
  id: string
  name?: string
  amount?: number
  dueDate?: Date
}

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  async create(data: CreateGoalDto): Promise<GoalModel> {
    const goal = GoalModel.create(data)
    await this.goalRepository.save(goal)
    return goal
  }

  async update(data: UpdateGoalDto): Promise<GoalModel> {
    const goal = await this.goalRepository.findOneBy({ id: data.id })
    if (!goal) throw new GoalNotFoundException('Goal not found')
    const updatedGoal = GoalModel.createFrom({ ...goal, ...data })
    await this.goalRepository.update(updatedGoal)
    return updatedGoal
  }

  async delete(id: string): Promise<void> {
    await this.goalRepository.delete(id)
  }

  async findByOrganization(organizationId: string): Promise<GoalModel[]> {
    return this.goalRepository.findManyBy({ bankAccountId: organizationId })
  }
}
