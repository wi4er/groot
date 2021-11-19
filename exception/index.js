const WrongIdError = require("./WrongIdError");
const PermissionError = require("./PermissionError");
const WrongRefError = require("./WrongRefError");
const {Error: {ValidationError}} = require("mongoose");

function formatError(err) {
    return {
        message: err.message
    };
}

module.exports = (err, req, res, next) => {
    console.log(err.message);

    switch (err.constructor) {
        case WrongIdError: {
            res.status(404).send(formatError(err));

            break;
        }

        case PermissionError: {
            res.status(403).send(formatError(err));

            break;
        }

        case ValidationError: {
            res.status(400).send(err.message);

            break;
        }

        case WrongRefError: {
            res.status(400).send(formatError(err));

            break;
        }

        default: {
            res.status(500).send(formatError(err));
        }
    }
}
