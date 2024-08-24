export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export abstract class DefaultModel {
  id: any
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
