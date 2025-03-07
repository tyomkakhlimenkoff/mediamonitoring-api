export class UnableToGetTitleFromPageError extends Error {
  public constructor(url: string) {
    super(`Unable to title from HTML page "${url}".`);
  }
}
