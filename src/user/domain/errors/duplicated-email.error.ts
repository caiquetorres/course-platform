export class DuplicatedEmailError extends Error {
  private constructor(message: string) {
    super(message);
  }

  static withEmail(email: string) {
    return new DuplicatedEmailError(
      `The email '${email}' has already been registered.`,
    );
  }
}
