const {Router} = require("express");
const router = Router();
const Permission = require("../model/Permission");
const {PERMISSION} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const permissionQuery = {
    parseFilter: require("./filter")( {
        "field": {
            ...require("./filter/fieldFilter"),
        },
    }),
    parseSort: require("./sort")({

    }),
};

router.get(
    "/",
    permissionCheck([PERMISSION], GET),
    createGet(Permission, permissionQuery),
);

router.get(
    "/:id/",
    permissionCheck([PERMISSION], GET),
    createGetById(Permission),
);

router.post(
    "/",
    permissionCheck([PERMISSION], POST),
    createPost(Permission),
);

router.put(
    "/:id/",
    permissionCheck([PERMISSION], PUT),
    createPut(Permission),
);

router.delete(
    "/:id/",
    permissionCheck([PERMISSION], DELETE),
    createDelete(Permission),
);

module.exports = router;
