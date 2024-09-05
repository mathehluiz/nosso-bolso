import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { createNestApp } from '@testInfra/test-e2e.setup'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { AppModule } from '@src/app.module'
import { BankAccountRepository } from '../../persistence/repository/bank-account.repository'
import { BankAccountModel } from '../../core/model/bank-account.model'

describe('Transaction management e2e test', () => {
  let app: INestApplication
  let module: TestingModule
  let accessToken: string
  let prisma: PrismaClient
  let bankAccountRepo: BankAccountRepository

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([AppModule])
    app = nestTestSetup.app
    module = nestTestSetup.module

    prisma = module.get<PrismaService>(PrismaService)
    bankAccountRepo = module.get<BankAccountRepository>(BankAccountRepository)
    await prisma.$transaction([
      prisma.user.create({
        data: {
          id: 'user-id',
          email: 'xpto@gmail.com',
          password: await hash('123456', 10),
          name: 'xpto',
          member_on: {
            create: {
              id: 'member-id',
              role: 'OWNER',
              organization: {
                create: {
                  id: 'org-id',
                  name: 'xpto',
                  slug: 'xpto',
                  ownerId: 'user-id',
                },
              },
            },
          },
        },
      }),
    ])
  })

  beforeEach(async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'xpto@gmail.com', password: '123456' })

    expect(loginResponse.status).toBe(HttpStatus.OK)
    accessToken = loginResponse.body.accessToken
  })

  afterEach(async () => {
    await bankAccountRepo.clear()
  })

  afterAll(async () => {
    await app.close()
    await prisma.bankAccount.deleteMany()
    await prisma.member.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.user.deleteMany()
    module.close()
  })

  describe('/bank-accounts (POST)', () => {
    it('creates a new bank account', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-accounts')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          name: 'bankAccount',
          balance: 0,
          ownerId: 'member-id',
        })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'bankAccount',
        balance: 0,
        ownerId: 'member-id',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      })
    })

    it('throws error when organization does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'non-existent-org-id')
        .send({
          name: 'bankAccount',
          balance: 0,
          ownerId: 'member-id',
        })

      expect(response.status).toBe(HttpStatus.FORBIDDEN)
    })
  })

  describe('/bank-accounts/:id (PATCH)', () => {
    it('updates a bank account', async () => {
      const model = BankAccountModel.create({
        name: 'bankAccount',
        balance: 0,
        ownerId: 'member-id',
        organizationId: 'org-id',
      })
      await bankAccountRepo.save(model)

      const response = await request(app.getHttpServer())
        .patch(`/bank-accounts/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          name: 'newBankAccount',
          balance: 100,
        })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        id: model.id,
        name: 'newBankAccount',
        balance: 100,
        ownerId: 'member-id',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      })
    })

    it('throws error when bank account does not exist', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/bank-accounts/${'non-existent-id'}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'newBankAccount',
          balance: 100,
        })

      expect(response.status).toBe(HttpStatus.FORBIDDEN)
    })
  })

  describe('/bank-accounts (GET)', () => {
    it('gets all organization bank accounts', async () => {
      const model = BankAccountModel.create({
        name: 'bankAccount',
        balance: 0,
        ownerId: 'member-id',
        organizationId: 'org-id',
      })
      await bankAccountRepo.save(model)

      const response = await request(app.getHttpServer())
        .get('/bank-accounts')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual([
        {
          id: model.id,
          name: 'bankAccount',
          balance: 0,
          ownerId: 'member-id',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
        },
      ])
    })
  })

  describe('/bank-accounts/:id (DELETE)', () => {
    it('deletes a bank account', async () => {
      const model = BankAccountModel.create({
        name: 'bankAccount',
        balance: 0,
        ownerId: 'member-id',
        organizationId: 'org-id',
      })
      await bankAccountRepo.save(model)

      const response = await request(app.getHttpServer())
        .delete(`/bank-accounts/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')

      expect(response.status).toBe(HttpStatus.OK)
    })

    it('throws error when bank account does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/bank-accounts/${'non-existent-id'}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })
  })
})
