export type ApplicationStatuses = 'wait_listed' | 'accepted' | 'rejected';

export class ApplicationStatus {
  get value() {
    return this._value;
  }

  static default = new ApplicationStatus('wait_listed');

  static statuses = ['wait_listed', 'accepted', 'rejected'];

  constructor(private readonly _value: ApplicationStatuses) {}

  toString() {
    return this.value;
  }
}
