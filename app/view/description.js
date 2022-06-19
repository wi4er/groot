const {Router} = require("express");
const router = Router();
const Description = require("../model/Description");
const WrongIdError = require("../exception/WrongIdError");
const descriptionQuery = require("../query/descriptionQuery");
const {DESCRIPTION, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([DESCRIPTION, PUBLIC], GET),
    (req, res, next) => {
        const {query: {filter, sort, limit, offset}} = req;
        const parsedFilter = descriptionQuery.parseFilter(filter);
        const parsedSort = descriptionQuery.parseFilter(sort);

        Promise.all([
            Description.count(parsedFilter),
            Description.find(parsedFilter)
                .sort(parsedSort)
                .limit(+limit)
                .skip(+offset),
        ])
            .then(([count, result]) => {
                res.header("total-row-count", count);
                res.header("Access-Control-Expose-Headers", "total-row-count");

                res.json(result);
            })
            .catch(next);
    }
);

router.get(
    "/:id/",
    permissionCheck([DESCRIPTION, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Description.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find property with id ${id}!`);

                res.json(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([DESCRIPTION, PUBLIC], POST),
    (req, res, next) => {
        new Description(req.body).save()
            .then(result => {
                res.status(201);
                res.json(result);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([DESCRIPTION, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Description.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update description with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.json(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([DESCRIPTION, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Description.findById(id)
            .then(async description => {
                WrongIdError.assert(description, `Cant delete description with id ${id}!`);
                WrongIdError.assert(await description.delete(), `Cant delete description with id ${id}!`);

                res.json(description);
            })
            .catch(next);
    }
);


module.exports = router;
