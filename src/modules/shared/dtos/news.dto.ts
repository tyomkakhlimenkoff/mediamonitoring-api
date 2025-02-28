export class NewsDto {
  public constructor(
    public readonly id: string,
    public readonly createdAt: string,
    public readonly url: string,
    public readonly title: string,
  ) {}
}
