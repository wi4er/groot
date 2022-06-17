const {Router} = require("express");
const Content = require("../model/Content");
const WrongIdError = require("../exception/WrongIdError");
const router = Router();
const {CONTENT, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const withCache = require("../cache/withCache");
const contentQuery = require("../query/contentQuery");

router.get(
    "/",
    permissionCheck([CONTENT, PUBLIC], GET),
    // withCache(CONTENT),
    (req, res, next) => {
        const {query: {filter, sort, limit, offset}} = req;
        const parsedFilter = contentQuery.parseFilter(filter);
        const parsedSort = contentQuery.parseSort(sort);

        Promise.all([
            Content.count(parsedFilter),
            Content.find(parsedFilter)
                .sort(parsedSort)
                .limit(+limit)
                .skip(+offset)
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
    permissionCheck([CONTENT, PUBLIC], GET),
    (req, res, next) => {
        const {params: {id}} = req;

        Content.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find content with id ${id}!`);

                res.json(result);
            })
            .catch(next);
    }
);

router.post(
    "/",
    permissionCheck([CONTENT, PUBLIC], POST),
    (req, res, next) => {
        new Content(req.body).save()
            .then(inst => {
                res.status(201);
                res.json(inst);
            })
            .catch(next);
    }
);

router.put(
    "/:id/",
    permissionCheck([CONTENT, PUBLIC], PUT),
    (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Content.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update content with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.json(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([CONTENT, PUBLIC], DELETE),
    (req, res, next) => {
        const {params: {id}} = req;

        Content.findById(id)
            .then(async content => {
                WrongIdError.assert(content, `Cant delete content with id ${id}!`);
                WrongIdError.assert(await content.delete(), `Cant delete content with id ${id}!`);

                return res.json(content);
            })
            .catch(next);
    }
);

module.exports = router;
