import { ConfigModule } from '@configs/environment-variables/config.module';
import { DatabaseConfig } from '@configs/environment-variables/env-configs/database.config';
import { Module } from '@nestjs/common';
import { NewsModule } from '@news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';

const configModules = [
  ConfigModule,
  TypeOrmModule.forRootAsync({
    useExisting: DatabaseConfig,
  }),
];

const featureModules = [NewsModule];

@Module({
  imports: [...configModules, ...featureModules],
})
export class AppModule {}
