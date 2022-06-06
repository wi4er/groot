const {Router} = require("express");
const router = Router();
const Uniq = require("../model/Uniq");
const WrongIdError = require("../exception/WrongIdError");
const {UNIQ, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([UNIQ, PUBLIC], GET),
    (req, res, next) => {
        Uniq.find(
        )
            .then(result => res.send(result))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([UNIQ, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Uniq.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find uniq with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([UNIQ, PUBLIC], POST),
    (req, res, next) => {
        new Uniq(req.body).save()
            .then(inst => {
                res.status(201);
                res.send(inst);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([UNIQ, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Uniq.findById(id)
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
    permissionCheck([UNIQ, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Uniq.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete status with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
