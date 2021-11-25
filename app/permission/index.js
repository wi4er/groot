const env = require("../../environment");

module.exports = require('express-jwt')({
    secret: env.SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
});
