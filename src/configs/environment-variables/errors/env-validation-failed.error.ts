export class EnvValidationFailedError extends Error {
  public constructor(errorMessage: string) {
    super(`Unable to read environment variables. Reason: ${errorMessage}`);
  }
}
