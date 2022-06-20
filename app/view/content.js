const {Router} = require("express");
const Content = require("../model/Content");
const router = Router();
const {CONTENT, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const contentQuery =  {
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
        },
        "event": {
            ...require("./filter/eventFilter"),
        }
    }),
    parseSort: require("./sort")({

    }),
};

router.get(
    "/",
    permissionCheck([CONTENT, PUBLIC], GET),
    // withCache(CONTENT),
    createGet(Content, contentQuery),
);

router.get(
    "/:id/",
    permissionCheck([CONTENT, PUBLIC], GET),
    createGetById(Content),
);

router.post(
    "/",
    permissionCheck([CONTENT, PUBLIC], POST),
    createPost(Content),
);

router.put(
    "/:id/",
    permissionCheck([CONTENT, PUBLIC], PUT),
    createPut(Content),
);

router.delete(
    "/:id/",
    permissionCheck([CONTENT, PUBLIC], DELETE),
    createDelete(Content),
);

module.exports = router;
