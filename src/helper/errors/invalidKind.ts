export class InvalidKindError extends Error {
  constructor(expected: string, got: string) {
    super(`Expected '${expected}', got '${got}'`);
  }
}
