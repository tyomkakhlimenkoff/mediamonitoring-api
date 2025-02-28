export enum FileType {
  HTML = 'Html',
}

export class CreateFileCommand {
  public constructor(
    public readonly fileContent: string,
    public readonly fileType: FileType,
  ) {}
}
