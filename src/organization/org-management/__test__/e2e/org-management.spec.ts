import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { createNestApp } from '@testInfra/test-e2e.setup'
import { User } from '@prisma/client'
import { OrganizationManagementModule } from '../../org-management.module'
import { UserRepository } from '../../persistence/repository/user.repository'
import { MembershipRepository } from '../../persistence/repository/membership.repository'
import { OrganizationRepository } from '../../persistence/repository/organization.repository'
import { UserModel } from '../../core/model/user.model'
import { OrganizationModel } from '../../core/model/organization.model'
import { hash } from 'bcrypt'

describe('Organization management e2e test', () => {
  let app: INestApplication
  let module: TestingModule
  let userRepo: UserRepository
  let memberRepo: MembershipRepository
  let orgRepo: OrganizationRepository
  let user: User
  let accessToken: string

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([OrganizationManagementModule])
    app = nestTestSetup.app
    module = nestTestSetup.module

    userRepo = module.get<UserRepository>(UserRepository)
    memberRepo = module.get<MembershipRepository>(MembershipRepository)
    orgRepo = module.get<OrganizationRepository>(OrganizationRepository)
    const model = UserModel.create({
      email: 'xpto@gmail.com',
      name: 'John Doe',
      password: await hash('123456', 10),
    })
    user = model as User
    await userRepo.save(model)
  })

  beforeEach(async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'xpto@gmail.com', password: '123456' })

    expect(loginResponse.status).toBe(HttpStatus.OK)
    accessToken = loginResponse.body.accessToken
  })

  afterEach(async () => {
    await memberRepo.clear()
    await orgRepo.clear()
  })

  afterAll(async () => {
    await app.close()
    await userRepo.clear()
    module.close()
  })

  describe('/organization (POST)', () => {
    it('creates a new organization', async () => {
      const response = await request(app.getHttpServer())
        .post('/organization')
        .send({
          name: 'Org Name',
          slug: 'org-name',
          ownerId: user.id,
        })
        .expect(HttpStatus.CREATED)
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Org Name',
          slug: 'org-name',
          ownerId: user.id,
        }),
      )
    })

    it('returns not found when user does not exist', async () => {
      const orgModel = OrganizationModel.create({
        name: 'Org Name',
        ownerId: 'non-existing-id',
      })
      await request(app.getHttpServer())
        .post('/organization')
        .send(orgModel)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  })

  describe('/organization (GET)', () => {
    it('returns organization by id', async () => {
      const orgModel = OrganizationModel.create({
        name: 'Org Name',
        ownerId: user.id,
      })
      await orgRepo.save(orgModel)
      const response = await request(app.getHttpServer())
        .get(`/organization`)
        .set('x-org-id', orgModel.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK)

      expect(response.body).toEqual(
        expect.objectContaining({
          id: orgModel.id,
          name: 'Org Name',
          slug: 'org-name',
          ownerId: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )
    })

    it('returns error when organization does not exist', async () => {
      await request(app.getHttpServer())
        .get('/organization')
        .set('x-org-id', 'non-existing-id')
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatus.FORBIDDEN)
    })
  })

  describe('/organization/invite (POST)', () => {
    it('invites a member to an organization', async () => {
      const orgModel = OrganizationModel.create({
        name: 'Org Name',
        ownerId: user.id,
      })
      await orgRepo.save(orgModel)
      const user2 = UserModel.create({
        email: 'asdasd@gmail.com',
        name: 'John Doe',
        password: '123456',
      })
      await userRepo.save(user2)
      await request(app.getHttpServer())
        .post(`/organization/invite`)
        .set('x-org-id', orgModel.id)
        .auth(accessToken, { type: 'bearer' })
        .send({
          userId: user2.id,
          role: 'MEMBER',
        })
        .expect(HttpStatus.CREATED)
    })

    it('throws error when user is already a member', async () => {
      const orgModel = OrganizationModel.create({
        name: 'Org Name',
        ownerId: user.id,
      })
      await orgRepo.save(orgModel)
      await request(app.getHttpServer())
        .post(`/organization/invite`)
        .set('x-org-id', orgModel.id)
        .auth(accessToken, { type: 'bearer' })
        .send({
          userId: user.id,
          role: 'MEMBER',
        })
        .expect(HttpStatus.CONFLICT)
    })

    it('throws error when organization does not exist', async () => {
      await request(app.getHttpServer())
        .post('/organization/invite')
        .set('x-org-id', 'non-existing-id')
        .auth(accessToken, { type: 'bearer' })
        .send({
          userId: user.id,
          role: 'MEMBER',
        })
        .expect(HttpStatus.FORBIDDEN)
    })
  })
})
