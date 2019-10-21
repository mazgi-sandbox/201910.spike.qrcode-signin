import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from 'typeorm'
import Config from 'config'
import { LoadEvent } from 'typeorm/subscriber/event/LoadEvent'
import User from 'entities/User'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): Function {
    return User
  }

  beforeInsert(event: InsertEvent<User>): void {
    // console.log(`BEFORE INSERT: `, event.entity)
  }

  beforeUpdate(event: UpdateEvent<User>): void {
    // console.log(`BEFORE ENTITY UPDATED: `, event.entity)
  }

  beforeRemove(event: RemoveEvent<User>): void {
    // console.log(
    //   `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
    //   event.entity
    // )
  }

  afterRemove(event: RemoveEvent<User>): void {
    // console.log(
    //   `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
    //   event.entity
    // )
  }

  async afterLoad(entity: User, event: LoadEvent<User>): Promise<void> {
    // console.log(`AFTER LOAD: `, entity, event)
  }
}
