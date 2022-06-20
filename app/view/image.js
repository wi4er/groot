const {Router} = require("express");
const router = Router();
const Image = require("../model/Image");
const {IMAGE, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const imageQuery = {
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
}

router.get(
    "/",
    permissionCheck([IMAGE, PUBLIC], GET),
    createGet(Image, imageQuery),
);

router.get(
    "/:id/",
    permissionCheck([IMAGE, PUBLIC], GET),
    createGetById(Image),
);

router.post(
    "/",
    permissionCheck([IMAGE, PUBLIC], POST),
    createPost(Image),
);

router.put(
    "/:id/",
    permissionCheck([IMAGE, PUBLIC], PUT),
    createPut(Image),
);

router.delete(
    "/:id/",
    permissionCheck([IMAGE, PUBLIC], DELETE),
    createDelete(Image),
);

module.exports = router;
