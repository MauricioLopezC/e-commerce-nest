export class StockError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StockError"
  }
}
