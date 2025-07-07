export class UploadImageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UploadImageError'
  }
}
