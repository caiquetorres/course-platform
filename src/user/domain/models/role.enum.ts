/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Represents the possible roles that a user can have.
 */
export enum Role {
  guest = 'guest',
  user = 'user',
  author = 'author',
  pro = 'pro',
  admin = 'admin',
}

export namespace Role {
  /**
   * Determines if a given value is a valid role.
   *
   * @param value The value to check.
   * @returns whether the value is a valid role.
   */
  export function isRole(value: any): value is Role {
    return Object.values(Role)
      .filter((el) => typeof el === 'string')
      .includes(value);
  }
}
