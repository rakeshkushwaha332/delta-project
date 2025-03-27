class ExpressError extends Error {
    /**
     * Custom error class for Express.
     * @param {number} statusCode - HTTP status code.
     * @param {string} message - Error message.
     */
    constructor(statusCode = 500, message = "Something went wrong") {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ExpressError;
