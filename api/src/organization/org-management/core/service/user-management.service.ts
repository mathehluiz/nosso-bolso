import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../persistence/repository/user.repository'
import { UserModel } from '../model/user.model'
import { DomainException } from '@src/shared/core/exception/domain.exception'
import { hash } from 'bcrypt'
import { NotFoundDomainException } from '@src/shared/core/exception/not-found-domain.exception'

export interface CreateUserDto {
  avatar?: string
  name: string
  email: string
  password: string
}

export interface UpdateUserDto {
  id: string
  avatar?: string
  name?: string
}

export interface ChangePasswordDto {
  userId: string
  password: string
  newPassword: string
}

export const PASSWORD_HASH_SALT = 10

@Injectable()
export class UserManagementService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: CreateUserDto) {
    if (!this.validateEmail(user.email)) {
      throw new DomainException(`Invalid email: ${user.email}`)
    }

    const newUser = UserModel.create({
      ...user,
      password: await hash(user.password, PASSWORD_HASH_SALT),
    })

    await this.userRepository.save(newUser)
    return newUser
  }

  async update(user: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOneBy({ id: user.id })
    if (!userToUpdate) throw new NotFoundDomainException(`User not found: ${user.id}`)

    const updatedUser = UserModel.createFrom({
      ...userToUpdate,
      ...user,
    })

    await this.userRepository.update(updatedUser)
    return updatedUser
  }

  async changePassword(input: ChangePasswordDto) {
    const user = await this.userRepository.findOneBy({ id: input.userId })
    if (!user) throw new NotFoundDomainException(`User not found: ${input.userId}`)

    const isPasswordValid = await this.validatePassword(user.password, input.password)
    if (!isPasswordValid) throw new DomainException('Invalid password')

    user.password = await hash(input.newPassword, PASSWORD_HASH_SALT)
    await this.userRepository.update(user)
  }

  async getMe(userId: string) {
    return this.userRepository.findOneById(userId)
  }

  private async validatePassword(hashed: string, password: string): Promise<boolean> {
    return hashed === (await hash(password, PASSWORD_HASH_SALT))
  }

  private validateEmail(email: string): boolean {
    const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexPattern.test(email)
  }

  async getUserById(id: string) {
    return this.userRepository.findOneBy({ id })
  }
}
