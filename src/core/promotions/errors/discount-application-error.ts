
export class DiscountApplicationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DiscountError'
  }
}
