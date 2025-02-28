import { DatabaseEnv } from '@configs/environment-variables/env-configs/database.env';
import { Provider } from '@nestjs/common';
import { mapEnvToConfigClass } from '@configs/environment-variables/map-env-to-config-class';

export const configProviders: Provider[] = [
  {
    provide: DatabaseEnv,
    useValue: mapEnvToConfigClass(DatabaseEnv),
  },
];
