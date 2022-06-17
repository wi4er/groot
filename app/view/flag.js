const {Router} = require("express");
const router = Router();
const Flag = require("../model/Flag");
const statusQuery = require("../query/statusQuery");
const WrongIdError = require("../exception/WrongIdError");
const {STATUS, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([STATUS, PUBLIC], GET),
    (req, res, next) => {
        Flag.find(
            statusQuery.parseFilter(req.query.filter)
        )
            .then(result => res.json(result))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Flag.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find status with id ${id}!`);

                res.json(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([STATUS, PUBLIC], POST),
    (req, res, next) => {
        new Flag(req.body).save()
            .then(inst => {
                res.status(201);
                res.json(inst);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Flag.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update status with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.json(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Flag.findById(id)
            .then(async flag => {
                WrongIdError.assert(flag, `Cant delete status with id ${id}!`);
                WrongIdError.assert(await flag.delete(), `Cant delete status with id ${id}!`);

                res.json(flag);
            })
            .catch(next);
    }
);

module.exports = router;
