export class InvalidUserUsernameError extends Error {
  static withUsername(username: string) {
    return new InvalidUserUsernameError(
      `The username address '${username}' is invalid`,
    );
  }
}
