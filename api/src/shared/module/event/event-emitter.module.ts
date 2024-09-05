import { Module } from '@nestjs/common'
import { EventEmitterModule as NestEventEmitterModule } from '@nestjs/event-emitter'
import { EventEmitterService } from './service/event-emitter.service'

@Module({
  imports: [NestEventEmitterModule.forRoot()],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventEmitterModule {}
