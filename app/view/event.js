const {Router} = require("express");
const router = Router();
const Event = require("../model/Event");
const WrongIdError = require("../exception/WrongIdError");
const {EVENT} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([EVENT], GET),
    (req, res, next) => {
        Event.find(
            // statusQuery.parseFilter(req.query.filter)
        )
            .then(result => res.send(result))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([EVENT], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Event.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find status with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([EVENT], POST),
    (req, res, next) => {
        new Event(req.body).save()
            .then(inst => {
                res.status(201);
                res.send(inst);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([EVENT], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Event.findById(id)
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
    permissionCheck([EVENT], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Event.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete status with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
