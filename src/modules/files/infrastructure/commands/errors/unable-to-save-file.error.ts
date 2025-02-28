export class UnableToSaveFileError extends Error {
  public constructor(filePath: string) {
    super(`Unable to save file to path "${filePath}".`);
  }
}
