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
        Section.find(
            require("../query/sectionQuery").parseFilter(req.query.filter)
        )
            .then(result => res.send(result))
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

                res.send(result);
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
                res.send(inst);
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
            .then(saved => res.send(saved))
            .catch(next);
    }
);

router.delete(
    "/:id/",
    permissionCheck([SECTION, PUBLIC], DELETE),
    (req, res, next) => {
        const {id} = req.params;

        Section.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Can't delete section with id ${id}!`);

                return result.delete();
            })
            .then(() => res.send(true))
            .catch(next);
    }
);

module.exports = router;
