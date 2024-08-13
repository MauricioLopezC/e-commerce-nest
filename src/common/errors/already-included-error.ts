export class AlreadyIncludedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AlreadyIncludedError'
  }
}
