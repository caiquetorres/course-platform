export class InvalidOrMissingToken extends Error {
  constructor() {
    super('The informed token is no longer valid');
  }
}
