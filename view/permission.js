const {Router} = require("express");
const router = Router();
const Permission = require("../model/Permission");
const WrongIdError = require("../exception/WrongIdError");
const {PERMISSION} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([PERMISSION], GET),
    (req, res, next) => {
        Permission.find(
            // require("../query/permissionFilter").parseFilter(req.query.filter)
        )
            .then(result => res.send(result))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([PERMISSION], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Permission.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find permission with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([PERMISSION], POST),
    (req, res, next) => {
        new Permission(req.body).save()
            .then(result => {
                res.status(201);
                res.send(result);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([PERMISSION], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        Permission.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update permission with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.send(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([PERMISSION], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Permission.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete permission with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
