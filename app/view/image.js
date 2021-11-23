const {Router} = require("express");
const router = Router();
const imageQuery = require("../query/imageQuery");
const Image = require("../model/Image");
const WrongIdError = require("../exception/WrongIdError");
const {IMAGE, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([IMAGE, PUBLIC], GET),
    (req, res, next) => {
        Image.find(
            imageQuery.parseFilter(req.query.filter)
        )
            .then(response => res.send(response))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([IMAGE, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Image.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find image with id ${id}!`);

                res.send(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([IMAGE, PUBLIC], POST),
    (req, res, next) => {
        Object.assign(new Image(), req.body).save()
            .then(result => {
                res.status(201);
                res.send(result);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([IMAGE, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Image.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update image with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.send(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([IMAGE, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Image.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete image with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
