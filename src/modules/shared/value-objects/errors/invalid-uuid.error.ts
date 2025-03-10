export class InvalidUuidError extends Error {
  public constructor(value: string) {
    super(`Value "${value}" isn't a valid UUID.`);
  }
}
