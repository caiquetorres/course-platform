/**
 * Interface that represents any project entity.
 */
export interface IBaseEntity {
  /**
   * Property that defines the entity unique identifier.
   */
  id: string

  /**
   * Property that defines a date that represents when the entity was
   * created.
   */
  createdAt: Date

  /**
   * Property that defines a date that represents the last time that the
   * entity was updated.
   */
  updatedAt: Date

  /**
   * Property that defines a date that represents the last time that the
   * entity was deleted.
   */
  deletedAt: Date
}
