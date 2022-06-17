const {Router} = require("express");
const Section = require("../model/Section");
const WrongIdError = require("../exception/WrongIdError");
const router = Router();
const {SECTION, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");

router.get(
    "/",
    permissionCheck([SECTION, PUBLIC], GET),
    (req, res, next) => {
        const {query: {filter, sort, limit, offset}} = req;
        const parsedFilter = require("../query/sectionQuery").parseFilter(filter)

        Promise.all([
            Section.count(parsedFilter),
            Section.find(parsedFilter)
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
    permissionCheck([SECTION, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Section.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find section with id ${id}!`);

                res.json(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([SECTION, PUBLIC], POST),
    (req, res, next) => {
        new Section(req.body).save()
            .then(inst => {
                res.status(201);
                res.json(inst);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([SECTION, PUBLIC], PUT),
    (req, res, next) => {
        const {id} = req.params;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Section.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update section with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.json(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([SECTION, PUBLIC], DELETE),
    (req, res, next) => {
        const {id} = req.params;

        Section.findById(id)
            .then(async section => {
                WrongIdError.assert(section, `Can't delete section with id ${id}!`);
                WrongIdError.assert(await section.delete(), `Can't delete section with id ${id}!`);

                res.json(section);
            })
            .catch(next);
    }
);

module.exports = router;
