const {Router} = require("express");
const router = Router();
const Flag = require("../model/Flag");
const {STATUS, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const flagQuery =  {
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
};

router.get(
    "/",
    permissionCheck([STATUS, PUBLIC], GET),
    createGet(Flag, flagQuery),
);

router.get(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], GET),
    createGetById(Flag),
);

router.post(
    "/",
    permissionCheck([STATUS, PUBLIC], POST),
    createPost(Flag),
);

router.put(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], PUT),
    createPut(Flag),
);

router.delete(
    "/:id/",
    permissionCheck([STATUS, PUBLIC], DELETE),
    createDelete(Flag),
);

module.exports = router;
