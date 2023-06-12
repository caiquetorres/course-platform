export class InvalidUsernameOrPassword extends Error {
  constructor() {
    super(
      'Invalid username or password. Please check your credentials and try again',
    );
  }
}
