export class DuplicatedUsernameError extends Error {
  private constructor(message: string) {
    super(message);
  }

  static withUsername(username: string) {
    return new DuplicatedUsernameError(
      `The username '${username}' has already been registered.`,
    );
  }
}
