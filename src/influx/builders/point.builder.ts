import { Point } from '@influxdata/influxdb-client';

export class PointBuilder {
  private readonly _point: Point;

  constructor(measurementName: string) {
    this._point = new Point(measurementName);
  }

  withTimestamp(timestamp: number | string | Date) {
    this._point.timestamp(timestamp);
    return this;
  }

  withBoolean(name: string, value: boolean) {
    this._point.booleanField(name, value);
    return this;
  }

  withUint(name: string, value: number) {
    this._point.uintField(name, value);
    return this;
  }

  withInt(name: string, value: number) {
    this._point.intField(name, value);
    return this;
  }

  withFloat(name: string, value: number) {
    this._point.floatField(name, value);
    return this;
  }

  withString(name: string, value: string) {
    this._point.stringField(name, value);
    return this;
  }

  build() {
    return this._point;
  }
}
