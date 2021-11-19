const {Router} = require("express");
const router = Router();
const DirectoryValue = require("../model/DirectoryValue");
const WrongIdError = require("../exception/WrongIdError");
const {DIRECTORY_VALUE, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([DIRECTORY_VALUE, PUBLIC], GET),
    (req, res, next) => {
        DirectoryValue.find(
            // propertyQuery.parseFilter(req.query.filter)
        )
            .then(response => res.send(response))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([DIRECTORY_VALUE, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        DirectoryValue.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find directory value with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([DIRECTORY_VALUE, PUBLIC], POST),
    (req, res, next) => {
        new DirectoryValue(req.body).save()
            .then(result => {
                res.status(201);
                res.send(result);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([DIRECTORY_VALUE, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        DirectoryValue.findById(id)
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
    permissionCheck([DIRECTORY_VALUE, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        DirectoryValue.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete directory value with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
