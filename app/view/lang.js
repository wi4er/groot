const {Router} = require("express");
const router = Router();
const Lang = require("../model/Lang");
const {LANG} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const langQuery =  {
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
    permissionCheck([LANG], GET),
    createGet(Lang, langQuery),
);

router.get(
    "/:id/",
    permissionCheck([LANG], GET),
    createGetById(Lang),
);

router.post(
    "/",
    permissionCheck([LANG], POST),
    createPost(Lang),
);

router.put(
    "/:id/",
    permissionCheck([LANG], PUT),
    createPut(Lang),
);

router.delete(
    "/:id/",
    permissionCheck([LANG], DELETE),
    createDelete(Lang),
);

module.exports = router;
