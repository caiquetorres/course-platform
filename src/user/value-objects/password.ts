import { UnprocessableEntityException } from '@nestjs/common';

import { PASSWORD_REGEX } from '../../common/constants/password-regex.constant';
import bcryptjs from 'bcryptjs';

/**
 * Value object that represents the user's password.
 */
export class Password {
  private readonly _value: string;

  /**
   * The password's values.
   */
  get value() {
    return this._value;
  }

  constructor(value: string) {
    if (!PASSWORD_REGEX.test(value)) {
      throw new UnprocessableEntityException(
        'The provided password is invalid',
      );
    }

    const salt = bcryptjs.genSaltSync();
    this._value = bcryptjs.hashSync(value, salt);
  }
}
