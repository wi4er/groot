const WrongIdError = require("./WrongIdError");
const PermissionError = require("./PermissionError");
const WrongQueryArgument = require("./WrongQueryArgument");
const WrongRefError = require("./WrongRefError");
const {Error: {ValidationError}} = require("mongoose");
const {MongoServerError} = require("mongodb")
const {UnauthorizedError} = require("express-jwt");

function formatError(err) {
    return {
        message: err.message,
        type: err.name,
    };
}

module.exports = (err, req, res, next) => {
    console.log(err);

    switch (err.constructor) {
        case WrongIdError: {
            res.status(404);

            break;
        }

        case PermissionError: {
            res.status(403);

            break;
        }

        case UnauthorizedError: {
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

        case WrongQueryArgument: {
            res.status(400);

            break;
        }

        default: {
            res.status(500);
        }
    }

    res.json(formatError(err));
}
