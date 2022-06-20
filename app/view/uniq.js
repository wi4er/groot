const {Router} = require("express");
const router = Router();
const Uniq = require("../model/Uniq");
const {UNIQ, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const uniqQuery =  {
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
    }),
    parseSort: require("./sort")({

    }),
}

router.get(
    "/",
    permissionCheck([UNIQ, PUBLIC], GET),
    createGet(Uniq, uniqQuery),
);

router.get(
    "/:id/",
    permissionCheck([UNIQ, PUBLIC], GET),
    createGetById(Uniq),
);

router.post(
    "/",
    permissionCheck([UNIQ, PUBLIC], POST),
    createPost(Uniq),
);

router.put(
    "/:id/",
    permissionCheck([UNIQ, PUBLIC], PUT),
    createPut(Uniq),
);

router.delete(
    "/:id/",
    permissionCheck([UNIQ, PUBLIC], DELETE),
    createDelete(Uniq),
);

module.exports = router;
