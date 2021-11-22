module.exports = class GrootError extends Error {
    static assert(value, message) {
        if (!value) {
            throw new this(message);
        }
    }
}
