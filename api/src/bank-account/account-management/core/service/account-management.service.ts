import { Injectable } from '@nestjs/common'
import { BankAccountRepository } from '../../persistence/repository/bank-account.repository'
import { BankAccountModel } from '../model/bank-account.model'
import { BankAccountNotFoundException } from '../exception/bank-account-not-found.exception'

export interface CreateBankAccountDto {
  name: string
  balance: number
  ownerId: string
  organizationId: string
}

export interface UpdateBankAccountDto {
  id: string
  name?: string
  balance?: number
}

@Injectable()
export class AccountManagementService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async create(bankAccount: CreateBankAccountDto) {
    const model = BankAccountModel.create(bankAccount)
    await this.bankAccountRepository.save(model)
    return model
  }

  async update(bankAccount: UpdateBankAccountDto) {
    const model = await this.bankAccountRepository.findOneBy({ id: bankAccount.id })
    if (!model) throw new BankAccountNotFoundException('Bank account not found')
    const updatedModel = BankAccountModel.createFrom({ ...model, ...bankAccount })
    await this.bankAccountRepository.update(updatedModel)
    return updatedModel
  }

  async updateBalance(id: string, balance: number) {
    const model = await this.bankAccountRepository.findOneBy({ id })
    if (!model) throw new BankAccountNotFoundException('Bank account not found')
    model.balance = model.balance + balance
    await this.bankAccountRepository.update(model)
    return model
  }

  async getByOrganization(organizationId: string) {
    return this.bankAccountRepository.findManyBy({ organizationId })
  }

  async delete(id: string) {
    const model = await this.bankAccountRepository.findOneBy({ id })
    if (!model) throw new BankAccountNotFoundException('Bank account not found')
    await this.bankAccountRepository.delete(model.id)
  }
}
