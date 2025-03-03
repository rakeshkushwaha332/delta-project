// Custom error class for handling Express errors
class ExpressError extends Error {
    /**
     * Create a new ExpressError instance.
     * @param {number} statusCode - The HTTP status code for the error.
     * @param {string} message - The error message.
     */
    constructor(statusCode, message) {
        super(); // Call the parent Error class constructor
        this.statusCode = statusCode; // Set the status code
        this.message = message; // Set the error message

        // Optional: Capture the stack trace (useful for debugging)
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the ExpressError class
module.exports = ExpressError;