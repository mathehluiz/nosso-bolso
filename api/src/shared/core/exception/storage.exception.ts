export abstract class PersistenceException extends Error {}

export class PersistenceInternalException extends PersistenceException {}

export class PersistenceClientException extends PersistenceException {}
