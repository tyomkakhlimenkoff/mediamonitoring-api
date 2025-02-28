import { IsDefined, IsUrl } from 'class-validator';

export class CreateNewsRequest {
  @IsUrl(undefined, { message: `URL must be a valid url` })
  @IsDefined()
  url: string;
}
