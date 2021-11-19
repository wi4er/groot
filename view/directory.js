const {Router} = require("express");
const router = Router();
const Directory = require("../model/Directory");
const WrongIdError = require("../exception/WrongIdError");
const {DIRECTORY, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([DIRECTORY, PUBLIC], GET),
    (req, res, next) => {
        Directory.find(
            require("../query/directoryFilter").parseFilter(req.query.filter)
        )
            .then(result => res.send(result))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([DIRECTORY, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Directory.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find directory with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([DIRECTORY, PUBLIC], POST),
    (req, res, next) => {
        new Directory(req.body).save()
            .then(result => {
                res.status(201);
                res.send(result);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([DIRECTORY, PUBLIC], PUT),
    (req, res, next) => {
        const {id} = req.params;

        Directory.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update directory with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.send(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([DIRECTORY, PUBLIC], DELETE),
    (req, res, next) => {
        const {id} = req.params;

        Directory.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete directory with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
