const {Router} = require("express");
const router = Router();
const Value = require("../model/Value");
const {VALUE, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const valueQuery =  {
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
    permissionCheck([VALUE, PUBLIC], GET),
    createGet(Value, valueQuery),
);

router.get(
    "/:id/",
    permissionCheck([VALUE, PUBLIC], GET),
    createGetById(Value),
);

router.post(
    "/",
    permissionCheck([VALUE, PUBLIC], POST),
    createPost(Value),
);

router.put(
    "/:id/",
    permissionCheck([VALUE, PUBLIC], PUT),
    createPut(Value),
);

router.delete(
    "/:id/",
    permissionCheck([VALUE, PUBLIC], DELETE),
    createDelete(Value),
);

module.exports = router;
