import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<T>(event: string, data: T): boolean {
    return this.eventEmitter.emit(event, data)
  }
}
