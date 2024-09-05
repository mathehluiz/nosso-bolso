import { Injectable } from '@nestjs/common'
import { Role } from '../enum/role.enum'
import { MembershipRepository } from '../../persistence/repository/membership.repository'
import { DomainException } from '@src/shared/core/exception/domain.exception'
import { MembershipModel } from '../model/membership.model'
import { ConflictDomainException } from '@src/shared/core/exception/conflict-domain.exection'
import { UserRepository } from '../../persistence/repository/user.repository'

export interface CreateMembershipDto {
  organizationId: string
  email: string
}

@Injectable()
export class MembershipManagementService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(input: CreateMembershipDto) {
    const { organizationId, email } = input
    const user = await this.userRepository.findOneBy({ email })
    if (!user) {
      throw new DomainException(`User not found: ${email}`)
    }
    const member = await this.getMembership(organizationId, user.id)
    if (member) {
      throw new ConflictDomainException('User already a member of this organization')
    }
    const newMembership = MembershipModel.create({
      organizationId,
      userId: user.id,
      role: Role.MEMBER,
    })
    await this.membershipRepository.save(newMembership)
  }

  async remove(organizationId: string, userId: string) {
    const member = await this.getMembership(organizationId, userId)
    if (!member) throw new DomainException('User is not a member of this organization')

    if (member.role === Role.OWNER) throw new DomainException('Cannot remove owner')

    await this.membershipRepository.remove(member)
  }

  async getMembership(organizationId: string, userId: string) {
    return this.membershipRepository.findOneBy({ organizationId, userId })
  }

  async getMembers(organizationId: string) {
    return this.membershipRepository.findManyBy({ organizationId })
  }
}
