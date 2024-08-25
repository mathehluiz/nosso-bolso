import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { createNestApp } from '@testInfra/test-e2e.setup'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { TransactionRepository } from '../../persistence/repository/transaction.repository'
import { AppModule } from '@src/app.module'
import { TransactionModel } from '../../core/model/transaction.model'

describe('Transaction management e2e test', () => {
  let app: INestApplication
  let module: TestingModule
  let accessToken: string
  let prisma: PrismaClient
  let transactionRepo: TransactionRepository
  const bankAccountId = crypto.randomUUID()

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([AppModule])
    app = nestTestSetup.app
    module = nestTestSetup.module

    prisma = module.get<PrismaService>(PrismaService)
    transactionRepo = module.get<TransactionRepository>(TransactionRepository)
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
      prisma.bankAccount.create({
        data: {
          id: bankAccountId,
          name: 'bank account',
          ownerId: 'member-id',
          balance: 0,
          organizationId: 'org-id',
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
    await transactionRepo.clear()
  })

  afterAll(async () => {
    await app.close()
    await prisma.bankAccount.deleteMany()
    await prisma.member.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.user.deleteMany()
    module.close()
  })

  describe('/transactions (POST)', () => {
    it('creates a new transaction', async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          bankAccountId,
          amount: 100,
          type: 'INCOME',
        })
      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual(
        expect.objectContaining({
          amount: 100,
          bankAccountId,
          type: 'INCOME',
        }),
      )
    })

    it('throws error when bank account does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          bankAccountId: crypto.randomUUID(),
          amount: 100,
          type: 'INCOME',
        })
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  })

  describe('/transactions/:id (PATCH)', () => {
    it('updates a transaction', async () => {
      const model = TransactionModel.create({
        bankAccountId,
        amount: 100,
        type: 'INCOME',
        createdById: 'user-id',
      })
      await transactionRepo.save(model)

      const response = await request(app.getHttpServer())
        .patch(`/transactions/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          amount: 200,
        })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual(
        expect.objectContaining({
          amount: 200,
          bankAccountId,
          type: 'INCOME',
        }),
      )
    })

    it('throws error when transaction does not exist', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/transactions/${crypto.randomUUID()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          amount: 200,
        })
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })
  })
  describe('/transactions/:id (GET)', () => {
    it('gets a transaction', async () => {
      const model = TransactionModel.create({
        bankAccountId,
        amount: 100,
        type: 'INCOME',
        createdById: 'user-id',
      })
      await transactionRepo.save(model)

      const response = await request(app.getHttpServer())
        .get(`/transactions/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual(
        expect.objectContaining({
          amount: 100,
          bankAccountId,
          type: 'INCOME',
        }),
      )
    })

    it('throws error when transaction does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/transactions/${crypto.randomUUID()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })
  })

  describe('/transactions (DELETE)', () => {
    it('deletes a transaction', async () => {
      const model = TransactionModel.create({
        bankAccountId,
        amount: 100,
        type: 'INCOME',
        createdById: 'user-id',
      })
      await transactionRepo.save(model)
      const response = await request(app.getHttpServer())
        .delete(`/transactions/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
      expect(response.status).toBe(HttpStatus.OK)

      const deletedTransaction = await transactionRepo.findOneBy({ id: model.id })
      expect(deletedTransaction?.deletedAt).not.toBeNull()
    })

    it('throws error when transaction does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/transactions/${crypto.randomUUID()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })
  })
})
