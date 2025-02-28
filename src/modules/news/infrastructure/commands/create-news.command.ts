export class CreateNewsCommand {
  public constructor(
    public readonly url: string,
    public readonly title: string,
  ) {}
}
