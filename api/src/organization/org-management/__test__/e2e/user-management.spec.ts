import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { createNestApp } from '@testInfra/test-e2e.setup'
import { OrganizationManagementModule } from '../../org-management.module'
import { UserRepository } from '../../persistence/repository/user.repository'
import { MembershipRepository } from '../../persistence/repository/membership.repository'
import { OrganizationRepository } from '../../persistence/repository/organization.repository'

describe('User management e2e test', () => {
  let app: INestApplication
  let module: TestingModule
  let userRepo: UserRepository
  let memberRepo: MembershipRepository
  let orgRepo: OrganizationRepository

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([OrganizationManagementModule])
    app = nestTestSetup.app
    module = nestTestSetup.module

    userRepo = module.get<UserRepository>(UserRepository)
    memberRepo = module.get<MembershipRepository>(MembershipRepository)
    orgRepo = module.get<OrganizationRepository>(OrganizationRepository)
  })

  afterEach(async () => {
    await memberRepo.clear()
    await orgRepo.clear()
    await userRepo.clear()
  })

  afterAll(async () => {
    await app.close()
    await userRepo.clear()
    module.close()
  })

  describe('/user (POST)', () => {
    it('creates a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user')
        .send({
          email: 'a@gmail.com',
          name: 'John Doe',
          password: '12312312',
        })
        .expect(HttpStatus.CREATED)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: 'a@gmail.com',
          name: 'John Doe',
        }),
      )
    })
  })
})
