class ExpressErr extends Error {
    constructor(message,statusCode ) {
        super();
        this.statusCode = statusCode; // Assign the custom status code
        this.message = message;
    }
}

module.exports = ExpressErr;
