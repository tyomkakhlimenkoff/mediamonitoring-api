import { InvalidUuidError } from '@shared/value-objects/errors/invalid-uuid.error';
import { validate, v4 } from 'uuid';

export class Uuid {
  private constructor(private readonly props: { value: string }) {}

  public get value(): string {
    return this.props.value;
  }

  public static createFromString(value: string): Uuid {
    if (!validate(value)) {
      throw new InvalidUuidError(value);
    }

    return new Uuid({ value });
  }

  public static generate(): Uuid {
    return new Uuid({ value: v4() });
  }
}
