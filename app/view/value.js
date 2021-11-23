const {Router} = require("express");
const router = Router();
const Value = require("../model/Value");
const WrongIdError = require("../exception/WrongIdError");
const {VALUE, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([VALUE, PUBLIC], GET),
    (req, res, next) => {
        Value.find(
            require("../query/valueQuery").parseFilter(req.query.filter)
        )
            .then(response => res.send(response))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([VALUE, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Value.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find directory value with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([VALUE, PUBLIC], POST),
    (req, res, next) => {
        new Value(req.body).save()
            .then(result => {
                res.status(201);
                res.send(result);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([VALUE, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Value.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update directory value with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.send(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([VALUE, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Value.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete directory value with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
