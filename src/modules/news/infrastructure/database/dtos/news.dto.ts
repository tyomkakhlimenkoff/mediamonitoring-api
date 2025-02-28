import { Uuid } from '@shared/value-objects/uuid';

export class NewsDto {
  public constructor(
    public readonly id: Uuid,
    public readonly createdAt: Date,
    public readonly url: string,
    public readonly title: string,
  ) {}
}
