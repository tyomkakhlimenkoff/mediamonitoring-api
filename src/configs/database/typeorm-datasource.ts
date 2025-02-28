import { DataSource } from 'typeorm';
import { DatabaseConfig } from '@configs/environment-variables/env-configs/database.config';
import { DatabaseEnv } from '@configs/environment-variables/env-configs/database.env';
import { mapEnvToConfigClass } from '@configs/environment-variables/map-env-to-config-class';

const databaseConfig = new DatabaseConfig(mapEnvToConfigClass(DatabaseEnv));

export default new DataSource(databaseConfig.createTypeOrmOptions());
