export class ForbiddenError extends Error {
  constructor() {
    super('You do not have permissions to access these sources');
  }
}
