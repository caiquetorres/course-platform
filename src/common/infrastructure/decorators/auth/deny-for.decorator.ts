import { SetMetadata } from '@nestjs/common';

import { Role } from '../../../../user/enums/role.enum';

import { ROLES_KEY } from '../../../domain/constants/roles.constant';

/**
 * Defines who cannot access the route given a {@link pattern} throwing a
 * `ForbiddenException` in case of invalid.
 *
 * ### Example
 *
 * If the `admin` is a valid role then, `DenyFor('admin')`
 * will deny only users with this role of consuming the route.
 *
 * Another example is using [regex](https://en.wikipedia.org/wiki/Regular_expression)
 * expressions. You can use `DenyFor(new RegExp('.*'))` for denying any
 * valid user of consuming the route.
 *
 * @param pattern defines the regex pattern expression or the role name.
 */
export function DenyFor(pattern: string): MethodDecorator;

/**
 * Defines who cannot access the route given a {@link pattern} throwing a
 * `ForbiddenException` in case of invalid.
 *
 * ### Example
 *
 * If the `admin` is a valid role then, `DenyFor('admin')`
 * will deny only users with this role of consuming the route.
 *
 * Another example is using [regex](https://en.wikipedia.org/wiki/Regular_expression)
 * expressions. You can use `DenyFor(new RegExp('.*'))` for denying any
 * valid user of consuming the route.
 *
 * @param pattern defines the regex pattern expression or the role name.
 */
export function DenyFor(pattern: RegExp): MethodDecorator;

/**
 * Defines who cannot access the route given a {@link pattern} throwing a
 * `ForbiddenException` in case of invalid.
 *
 * ### Example
 *
 * If the `Role.admin` and `Role.user` are valid roles then,
 * `DenyFor(['admin','user'])` will deny users with at least one of
 * these roles of consuming the route.
 *
 * @param roles defines an array of roles.
 */
export function DenyFor(roles: Role[]): MethodDecorator;

export function DenyFor(value: string | RegExp | Role[]): MethodDecorator {
  return SetMetadata(ROLES_KEY, { type: 'deny', roles: value });
}
