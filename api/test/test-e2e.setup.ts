import { ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/app.module'

export const createNestApp = async (modules: any[] = [AppModule]) => {
  const module = await Test.createTestingModule({
    imports: modules,
  }).compile()

  const app = module.createNestApplication()
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.init()
  return { module, app }
}
