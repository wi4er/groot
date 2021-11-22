const WrongIdError = require("./WrongIdError");
const PermissionError = require("./PermissionError");
const WrongRefError = require("./WrongRefError");
const {Error: {ValidationError}} = require("mongoose");
const {MongoServerError} = require("mongodb")

function formatError(err) {
    return {
        message: err.message
    };
}

module.exports = (err, req, res, next) => {
    console.log(err.message);

    switch (err.constructor) {
        case WrongIdError: {
            res.status(404);

            break;
        }

        case PermissionError: {
            res.status(403);

            break;
        }

        case ValidationError: {
            res.status(400);

            break;
        }

        case WrongRefError: {
            res.status(400);

            break;
        }

        case MongoServerError: {
            res.status(400);

            break;
        }

        default: {
            res.status(500);
        }
    }

    res.json(formatError(err));
}
