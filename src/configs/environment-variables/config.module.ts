import { DatabaseConfig } from '@configs/environment-variables/env-configs/database.config';
import { Global, Module } from '@nestjs/common';
import { configProviders } from '@configs/environment-variables/config-providers';

const configs = [DatabaseConfig];

@Global()
@Module({
  exports: [...configs],
  providers: [...configProviders, ...configs],
})
export class ConfigModule {}
