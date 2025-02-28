import { EnvValidationFailedError } from '@configs/environment-variables/errors/env-validation-failed.error';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';

export const mapEnvToConfigClass = <ClassType extends object>(
  classType: ClassConstructor<ClassType>,
): ClassType => {
  dotenv.config();

  const instantiatedClass = plainToClass(classType, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
    ignoreDecorators: false,
    strategy: 'exposeAll',
  });

  const errors = validateSync(instantiatedClass);

  if (errors.length > 0) {
    throw new EnvValidationFailedError(errors.join('\n'));
  }

  return instantiatedClass;
};
