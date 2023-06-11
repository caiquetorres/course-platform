import { Role } from '../../../user/domain/models/role.enum';

/**
 * Interface for the allowed roles options object.
 */
export interface IRoleOptions {
  /**
   * Specifies whether the allowed roles are to be used for "allow" or
   * "deny" access control.
   */
  type: 'allow' | 'deny';

  /**
   * The roles that are allowed or denied access to the protected resource.
   * This can be a single string, a regular expression, or an array of Role
   * objects.
   */
  roles: string | RegExp | Role[];
}
