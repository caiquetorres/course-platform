export class UserNotFoundError extends Error {
  static withId(id: string) {
    return new UserNotFoundError(
      `The user identified by '${id}' was not found`,
    );
  }

  static withEmail(email: string) {
    return new UserNotFoundError(
      `The user identified by '${email}' was not found`,
    );
  }
}
