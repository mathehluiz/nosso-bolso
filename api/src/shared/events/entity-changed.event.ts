export class EntityChangedEvent<T> {
  constructor(
    public readonly operationType: string,
    public readonly entityId: string | number,
    public readonly entityData: T,
  ) {}
}
