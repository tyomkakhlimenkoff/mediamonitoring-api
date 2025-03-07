import { Uuid } from '@shared/value-objects/uuid';

export class CreateNewsReportCommand {
  public constructor(public readonly ids: Uuid[]) {}
}
