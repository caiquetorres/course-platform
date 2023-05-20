import { UnprocessableEntityException } from '@nestjs/common';

import { isEmail } from 'class-validator';

/**
 * Value object that represents a user email.
 */
export class Email {
  /**
   * The email's value.
   */
  get value() {
    return this._value;
  }

  constructor(private readonly _value: string) {
    if (!isEmail(_value)) {
      throw new UnprocessableEntityException(
        'The provided email address is invalid.',
      );
    }
  }
}
