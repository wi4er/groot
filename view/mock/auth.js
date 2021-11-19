const jwt = require("jsonwebtoken");

module.exports = [
    "authorization",
    `Bearer ${jwt.sign(
        {id: 1, admin: true},
        "hello world !",
        { algorithm: 'HS256'}
    )}`
];
