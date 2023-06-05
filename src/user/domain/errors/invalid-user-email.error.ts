export class InvalidUserEmailError extends Error {
  static withEmail(email: string) {
    return new InvalidUserEmailError(`The email address '${email}' is invalid`);
  }
}
