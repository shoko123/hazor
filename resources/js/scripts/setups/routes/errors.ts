export class PageNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "PageNotFoundError";
    }
}

export class EmptyResultSetError extends Error {
    constructor(message) {
        super(message);
        this.name = "EmptyResultSetError";
    }
}

export class ItemNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ItemNotFoundError";
    }
}

export class InvalidQueryError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidQueryError";
    }
}