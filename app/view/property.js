const {Router} = require("express");
const router = Router();
const propertyQuery = require("../query/propertyQuery");
const Property = require("../model/Property");
const WrongIdError = require("../exception/WrongIdError");
const {PROPERTY, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([PROPERTY, PUBLIC], GET),
    (req, res, next) => {
        Property.find(
            propertyQuery.parseFilter(req.query.filter)
        )
            .then(result => res.json(result))
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([PROPERTY, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Property.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find property with id ${id}!`);

                res.json(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([PROPERTY, PUBLIC], POST),
    (req, res, next) => {
        new Property(req.body).save()
            .then(result => {
                res.status(201);
                res.json(result);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([PROPERTY, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Property.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update property with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.json(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([PROPERTY, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Property.findById(id)
            .then(async property => {
                WrongIdError.assert(property, `Cant delete property with id ${id}!`);
                WrongIdError.assert(await property.delete(), `Cant delete property with id ${id}!`);

                res.json(property);
            })
            .catch(next);
    }
);

module.exports = router;
