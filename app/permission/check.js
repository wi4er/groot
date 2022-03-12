const Permission = require("../model/Permission");
const PermissionError = require("../exception/PermissionError");
const {PUBLIC} = require("./entity");
const environment = require("../../environment");


module.exports = (entity, method) => (req, res, next) => {
    if (
        entity.includes(PUBLIC)
        && environment.GRAND_PUBLIC_GET
    ) {
        next();
    }

    Permission.findOne({
        entity: {$in: entity},
        method,
        group: {$in: req.user?.group},
    })
        .then(row => {
            if (!row && !req.user?.admin) {
                next(new PermissionError("Permission denied!"));
            }

            next();
        })
        .catch(next);
}
