import { SetMetadata } from '@nestjs/common';

import { Role } from '../../../../user/domain/models/role.enum';

import { ROLES_KEY } from '../../../domain/constants/roles.constant';

/**
 * Defines who can access the route given a {@link pattern} throwing a
 * `ForbiddenException` in case of invalid.
 *
 * ### Example
 *
 * If the `admin` is a valid role then, `AllowFor('admin')`
 * will allow only users with this role of consuming the route.
 *
 * Another example is using [regex](https://en.wikipedia.org/wiki/Regular_expression)
 * expressions. You can use `AllowFor(new RegExp('.*'))` for allowing any
 * valid user of consuming the route.
 *
 * @param pattern defines the regex pattern expression or the role name.
 */
export function AllowFor(pattern: string): MethodDecorator;

/**
 * Defines who can access the route given a {@link pattern} throwing a
 * `ForbiddenException` in case of invalid.
 *
 * ### Example
 *
 * If the `admin` is a valid role then, `AllowFor('admin')`
 * will allow only users with this role of consuming the route.
 *
 * Another example is using [regex](https://en.wikipedia.org/wiki/Regular_expression)
 * expressions. You can use `AllowFor(new RegExp('.*'))` for allowing any
 * valid user of consuming the route.
 *
 * @param pattern defines the regex pattern expression or the role name.
 */
export function AllowFor(pattern: RegExp): MethodDecorator;

/**
 * Defines who can access the route given a {@link pattern} throwing a
 * `ForbiddenException` in case of invalid.
 *
 * ### Example
 *
 * If the `Role.admin` and `Role.user` are valid roles then,
 * `AllowFor(['admin','user'])` will allow users with at least one of
 * these roles of consuming the route.
 *
 * @param roles defines an array of roles.
 */
export function AllowFor(roles: Role[]): MethodDecorator;

export function AllowFor(value: string | RegExp | Role[]): MethodDecorator {
  return SetMetadata(ROLES_KEY, { type: 'allow', roles: value });
}
