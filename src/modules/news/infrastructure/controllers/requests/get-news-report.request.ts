import { ArrayNotEmpty, IsArray, IsDefined, IsUUID } from 'class-validator';
import { Uuid } from '@shared/value-objects/uuid';

export class GetNewsReportRequest {
  @IsUUID(4, { each: true, message: `id's must be a valid UUID's` })
  @ArrayNotEmpty()
  @IsArray()
  @IsDefined()
  newsIds: Uuid[];
}
