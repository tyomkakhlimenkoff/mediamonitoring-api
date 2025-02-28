export class EmptyTitleError extends Error {
  public constructor() {
    super('Web page title must contain at least 1 character.');
  }
}
