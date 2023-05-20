import { Course } from '../entities/course.entity';

import { Price } from '../value-objects/price';

export class CourseFactory {
  private _id: string | null = null;

  private _name: string | null = null;

  private _price: number | null = null;

  from(user: Course) {
    user ??= {} as any;

    this._id = user.id ?? null;
    this._name = user.name ?? null;
    this._price = user.price ?? null;

    return this;
  }

  withId(id: string) {
    this._id = id;
    return this;
  }

  withName(name: string) {
    this._name = name ?? null;
    return this;
  }

  withPrice(price: Price) {
    this._price = price.value ?? null;
    return this;
  }

  build() {
    return new Course({
      id: this._id,
      name: this._name,
      price: this._price,
    });
  }
}
