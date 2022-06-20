const {Router} = require("express");
const Description = require("../model/Description");
const {DESCRIPTION, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const router = Router();

const descriptionQuery = {
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
    permissionCheck([DESCRIPTION, PUBLIC], GET),
    createGet(Description, descriptionQuery),
);

router.get(
    "/:id/",
    permissionCheck([DESCRIPTION, PUBLIC], GET),
    createGetById(Description),
);

router.post(
    "/",
    permissionCheck([DESCRIPTION, PUBLIC], POST),
    createPost(Description),
);

router.put(
    "/:id/",
    permissionCheck([DESCRIPTION, PUBLIC], PUT),
    createPut(Description),
);

router.delete(
    "/:id/",
    permissionCheck([DESCRIPTION, PUBLIC], DELETE),
    createDelete(Description),
);


module.exports = router;
