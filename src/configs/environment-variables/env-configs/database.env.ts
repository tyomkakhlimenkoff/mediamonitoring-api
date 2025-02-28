import { Environment } from '@configs/enums/environment.config';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class DatabaseEnv {
  @IsEnum(Environment)
  @Expose()
  public ENVIRONMENT: Environment;

  @IsString()
  @MinLength(1)
  @IsUrl({
    require_host: true,
    require_port: false,
    require_protocol: false,
    require_tld: false,
    require_valid_protocol: true,
  })
  @Expose()
  public DB_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(64738)
  @Expose()
  public DB_PORT: number;

  @IsString()
  @MinLength(1)
  @Expose()
  public DB_NAME: string;

  @IsString()
  @MinLength(1)
  @Expose()
  public DB_USERNAME: string;

  @IsString()
  @MinLength(1)
  @Expose()
  public DB_PASSWORD: string;
}
