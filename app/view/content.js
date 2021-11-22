const {Router} = require("express");
const Content = require("../model/Content");
const WrongIdError = require("../exception/WrongIdError");
const router = Router();
const contentQuery = require("../query/contentQuery");
const {CONTENT, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const withCache = require("../cache/withCache");

router.get(
    "/",
    permissionCheck([CONTENT, PUBLIC], GET),
    withCache(CONTENT),
    (req, res, next) => {
        Content.find(
            contentQuery.parseFilter(req.query.filter)
        )
            .then(result => res.json(result))
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
    withCache(),
    (req, res, next) => {
        res.clearKey(CONTENT);

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
    withCache(),
    (req, res, next) => {
        const {params: {id}} = req;

        Content.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update content with id ${id}!`);
                res.clearKey(CONTENT);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.json(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([CONTENT, PUBLIC], DELETE),
    withCache(),
    (req, res, next) => {
        const {params: {id}} = req;

        Content.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant delete content with id ${id}!`);
                res.clearKey(CONTENT);

                return result.delete();
            })
            .then(() => res.json(true))
            .catch(next);
    }
);

module.exports = router;
