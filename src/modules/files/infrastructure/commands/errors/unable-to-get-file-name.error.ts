export class UnableToGetFileNameError extends Error {
  public constructor(fileType: string, fileId: string) {
    super(
      `Unable to get file name for file type "${fileType}" and file id "${fileId}".`,
    );
  }
}
