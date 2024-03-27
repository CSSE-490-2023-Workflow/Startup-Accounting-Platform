export class FuncArgError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}

export class NestedCallError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}