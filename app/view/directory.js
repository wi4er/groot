const {Router} = require("express");
const router = Router();
const Directory = require("../model/Directory");
const {DIRECTORY, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const directoryQuery = {
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
    permissionCheck([DIRECTORY, PUBLIC], GET),
    createGet(Directory, directoryQuery),
);

router.get(
    "/:id/",
    permissionCheck([DIRECTORY, PUBLIC], GET),
    createGetById(Directory),
);

router.post(
    "/",
    permissionCheck([DIRECTORY, PUBLIC], POST),
    createPost(Directory),
);

router.put(
    "/:id/",
    permissionCheck([DIRECTORY, PUBLIC], PUT),
    createPut(Directory),
);

router.delete(
    "/:id/",
    permissionCheck([DIRECTORY, PUBLIC], DELETE),
    createDelete(Directory),
);

module.exports = router;
