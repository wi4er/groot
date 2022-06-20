const {Router} = require("express");
const router = Router();
const Property = require("../model/Property");
const {PROPERTY, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const propertyQuery = {
    parseFilter: require("./filter")( {
        "field": {
            ...require("./filter/fieldFilter"),
        },
        "property": {
            ...require("./filter/propertyFilter"),
        },
        "flag": {
            ...require("./filter/flagFilter"),
        },
    }),
    parseSort: require("./sort")({

    }),

};

router.get(
    "/",
    permissionCheck([PROPERTY, PUBLIC], GET),
    createGet(Property, propertyQuery),
);

router.get(
    "/:id/",
    permissionCheck([PROPERTY, PUBLIC], GET),
    createGetById(Property),
);

router.post(
    "/",
    permissionCheck([PROPERTY, PUBLIC], POST),
    createPost(Property),
);

router.put(
    "/:id/",
    permissionCheck([PROPERTY, PUBLIC], PUT),
    createPut(Property),
);

router.delete(
    "/:id/",
    permissionCheck([PROPERTY, PUBLIC], DELETE),
    createDelete(Property),
);

module.exports = router;
