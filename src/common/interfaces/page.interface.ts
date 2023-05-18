/**
 * A generic class representing a paginated set of data.
 *
 * @template T The type of data contained in the page.
 */
export class IPage<T = any> {
  /**
   * The page number.
   */
  page: number;

  /**
   * The page total count.
   */
  hasNextPage: boolean;

  /**
   * The maximum number of items to include in the page.
   */
  limit: number;

  /**
   * An array of data items in the current page.
   */
  data: T[];
}
