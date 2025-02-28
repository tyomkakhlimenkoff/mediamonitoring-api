import { Uuid } from '@shared/value-objects/uuid';
import { FindOperator, ValueTransformer } from 'typeorm';

export class ColumnUuidTransformer implements ValueTransformer {
  from(valueFromDatabase: string | null): Uuid | null {
    if (valueFromDatabase === null) {
      return null;
    }

    return Uuid.createFromString(valueFromDatabase);
  }

  to(
    valueFromApplication: Uuid | FindOperator<Uuid> | null | undefined,
  ): string | FindOperator<string> | null {
    if (valueFromApplication === null || valueFromApplication === undefined) {
      return null;
    }

    if (valueFromApplication instanceof FindOperator) {
      return new FindOperator<string>(
        valueFromApplication.type,
        valueFromApplication.value.value,
        valueFromApplication.useParameter,
        valueFromApplication.multipleParameters,
        valueFromApplication.getSql,
        valueFromApplication.objectLiteralParameters,
      );
    }

    return valueFromApplication.value;
  }
}
