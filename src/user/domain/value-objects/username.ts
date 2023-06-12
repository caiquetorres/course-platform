export class Username {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: string) {
    this._validate(this.value);
    Object.freeze(this);
  }

  private _validate(username: string) {
    const regex = /^[a-z]+$/;

    if (!regex.test(username)) {
      throw new Error(`Invalid username '${username}'`);
    }
  }
}
