class FunctionNotExistError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export {FunctionNotExistError}