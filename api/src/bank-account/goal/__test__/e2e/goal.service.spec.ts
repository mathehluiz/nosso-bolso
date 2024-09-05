import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { createNestApp } from '@testInfra/test-e2e.setup'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { AppModule } from '@src/app.module'
import { GoalRepository } from '../../persistence/repository/goal.repository'
import { GoalModel } from '../../core/model/goal.model'

describe('Goal management e2e test', () => {
  let app: INestApplication
  let module: TestingModule
  let accessToken: string
  let prisma: PrismaClient
  let goalRepo: GoalRepository
  const bankAccountId = crypto.randomUUID()

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([AppModule])
    app = nestTestSetup.app
    module = nestTestSetup.module

    prisma = module.get<PrismaService>(PrismaService)
    goalRepo = module.get<GoalRepository>(GoalRepository)
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
    await goalRepo.clear()
  })

  afterAll(async () => {
    await app.close()
    await prisma.bankAccount.deleteMany()
    await prisma.member.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.user.deleteMany()
    module.close()
  })

  describe('/goals (POST)', () => {
    it('creates a new goal', async () => {
      const response = await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          bankAccountId,
          amount: 100,
          name: 'goal name',
          dueDate: new Date(),
        })
      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual(
        expect.objectContaining({
          amount: 100,
          bankAccountId,
          name: 'goal name',
        }),
      )
    })
  })

  describe('/goals/:id (PATCH)', () => {
    it('updates a goal', async () => {
      const model = GoalModel.create({
        bankAccountId,
        amount: 100,
        name: 'goal name',
        dueDate: new Date(),
      })
      await goalRepo.save(model)

      const response = await request(app.getHttpServer())
        .patch(`/goals/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          amount: 200,
          bankAccountId,
          name: 'new goal name',
          dueDate: new Date(),
        })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'new goal name',
        }),
      )
    })
  })

  describe('/goals/:id (DELETE)', () => {
    it('deletes a goal', async () => {
      const model = GoalModel.create({
        bankAccountId,
        amount: 100,
        name: 'goal name',
        dueDate: new Date(),
      })
      await goalRepo.save(model)

      const response = await request(app.getHttpServer())
        .delete(`/goals/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')

      expect(response.status).toBe(HttpStatus.OK)
    })
  })

  describe('/goals (GET)', () => {
    it('returns all organization goals', async () => {
      const model = GoalModel.create({
        bankAccountId,
        amount: 100,
        name: 'goal name',
        dueDate: new Date(),
      })
      await goalRepo.save(model)

      const response = await request(app.getHttpServer())
        .get('/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')

      expect(response.status).toBe(HttpStatus.OK)
    })
  })
})
