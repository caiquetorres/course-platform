export class Average {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: number) {
    Object.freeze(this);
  }

  valueOf() {
    return this.value;
  }
}
