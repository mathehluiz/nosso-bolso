import { Injectable } from '@nestjs/common'
import { OrganizationRepository } from '../../persistence/repository/organization.repository'
import { OrganizationModel } from '../model/organization.model'
import { OrganizationNotFoundException } from '../exception/organization-not-found.exception'

export interface CreateOrganizationDto {
  name: string
  ownerId: string
}

export interface InviteMemberDto {
  organizationId: string
  email: string
}

@Injectable()
export class OrganizationManagementService {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async create(input: CreateOrganizationDto) {
    const { name, ownerId } = input
    const org = OrganizationModel.create({
      name,
      ownerId,
    })

    await this.orgRepo.save(org)
    return org
  }

  async shutdown(id: string) {
    const org = await this.getOneById(id)
    await this.orgRepo.remove(org)
  }

  async getOneById(id: string) {
    const org = await this.orgRepo.findOneBy({ id })
    if (!org) throw new OrganizationNotFoundException()
    return org
  }
}
