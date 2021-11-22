const {Router} = require("express");
const router = Router();
const Status = require("../model/Status");
const statusQuery = require("../query/statusQuery");
const WrongIdError = require("../exception/WrongIdError");
const {STATUS, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([STATUS, PUBLIC], GET),
    (req, res, next) => {
        Status.find(
            statusQuery.parseFilter(req.query.filter)
        )
            .then(result => res.send(result))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Status.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find status with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([STATUS, PUBLIC], POST),
    (req, res, next) => {
        new Status(req.body).save()
            .then(inst => {
                res.status(201);
                res.send(inst);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        Status.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update status with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.send(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Status.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete status with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
