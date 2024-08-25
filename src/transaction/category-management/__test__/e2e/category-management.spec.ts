import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { createNestApp } from '@testInfra/test-e2e.setup'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { PrismaService } from '@src/shared/module/persistence/prisma/prisma.service'
import { AppModule } from '@src/app.module'
import { CategoryRepository } from '../../persistence/repository/category.repository'
import { CategoryModel } from '../../core/model/category.model'

describe('Transaction management e2e test', () => {
  let app: INestApplication
  let module: TestingModule
  let accessToken: string
  let prisma: PrismaClient
  let categoryRepo: CategoryRepository
  const bankAccountId = crypto.randomUUID()

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([AppModule])
    app = nestTestSetup.app
    module = nestTestSetup.module

    prisma = module.get<PrismaService>(PrismaService)
    categoryRepo = module.get<CategoryRepository>(CategoryRepository)
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
    await categoryRepo.clear()
  })

  afterAll(async () => {
    await app.close()
    await prisma.bankAccount.deleteMany()
    await prisma.member.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.user.deleteMany()
    module.close()
  })

  describe('/categories (POST)', () => {
    it('creates a new category', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')
        .send({
          name: 'category',
          color: '#000000',
          description: 'category description',
        })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'category',
        color: '#000000',
        description: 'category description',
      })
    })

    it('throws error when organization does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'non-existent-org-id')
        .send({
          name: 'category',
          color: '#000000',
          description: 'category description',
        })

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  })

  describe('/categories/:id (PATCH)', () => {
    it('updates a category', async () => {
      const model = CategoryModel.create({
        name: 'category',
        organizationId: 'org-id',
        color: '#000000',
        description: 'category description',
      })
      await categoryRepo.save(model)
      const response = await request(app.getHttpServer())
        .patch(`/categories/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'updated category',
          color: '#FFFFFF',
          description: 'updated category description',
        })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        id: model.id,
        name: 'updated category',
        color: '#FFFFFF',
        description: 'updated category description',
      })
    })

    it('throws error when category does not exist', async () => {
      const response = await request(app.getHttpServer())
        .patch('/categories/non-existent-category-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'category',
          color: '#000000',
          description: 'category description',
        })

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })
  })

  describe('/categories/:id (DELETE)', () => {
    it('deletes a category', async () => {
      const model = CategoryModel.create({
        name: 'category',
        organizationId: 'org-id',
        color: '#000000',
        description: 'category description',
      })
      await categoryRepo.save(model)
      const response = await request(app.getHttpServer())
        .delete(`/categories/${model.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(HttpStatus.NO_CONTENT)
    })

    it('throws error when category does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete('/categories/non-existent-category-id')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })
  })

  describe('/categories (GET)', () => {
    it('returns all organization categories', async () => {
      const model = CategoryModel.create({
        name: 'category',
        organizationId: 'org-id',
        color: '#000000',
        description: 'category description',
      })
      await categoryRepo.save(model)
      const response = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'org-id')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual([
        {
          id: model.id,
          name: 'category',
          color: '#000000',
          description: 'category description',
        },
      ])
    })

    it('throws error when organization does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-org-id', 'non-existent-org-id')

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  })
})
