const {Router} = require("express");
const Section = require("../model/Section");
const router = Router();
const {SECTION, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const sectionQuery = {
    parseFilter: require("./filter")({
        "field": {
            ...require("./filter/fieldFilter"),
        },
        "property": {
            ...require("./filter/propertyFilter"),
        },
        "flag": {
            ...require("./filter/flagFilter"),
        },
        "value": {
            ...require("./filter/valueFilter"),
        },
        "uniq": {
            ...require("./filter/uniqFilter"),
        }
    }),
    parseSort: require("./sort")({

    }),
};

router.get(
    "/",
    permissionCheck([SECTION, PUBLIC], GET),
    createGet(Section, sectionQuery),
);

router.get(
    "/:id/",
    permissionCheck([SECTION, PUBLIC], GET),
    createGetById(Section),
);

router.post(
    "/",
    permissionCheck([SECTION, PUBLIC], POST),
    createPost(Section),
);

router.put(
    "/:id/",
    permissionCheck([SECTION, PUBLIC], PUT),
    createPut(Section),
);

router.delete(
    "/:id/",
    permissionCheck([SECTION, PUBLIC], DELETE),
    createDelete(Section),
);

module.exports = router;
