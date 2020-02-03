class ValidationError extends Error {

    constructor(message) {
        super(message);
        this.message = message;
        this.code = 'ERR_VALIDATION';
        this.status = 422;
        this.statusCode = 422;
        this.name = this.constructor.name;
    }
}
module.exports = {
    ValidationError
};