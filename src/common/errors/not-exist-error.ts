export class NotExistError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotExistError'
  }
}
