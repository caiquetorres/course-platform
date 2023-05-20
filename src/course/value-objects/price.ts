import { UnprocessableEntityException } from '@nestjs/common';

export class Price {
  private readonly _price: number;

  get value() {
    return +this;
  }

  constructor(value: number) {
    if (value < 0) {
      throw new UnprocessableEntityException(
        'The price value must be greater than or equal to 0',
      );
    }

    this._price = value;
  }

  valueOf() {
    return this._price;
  }
}
