const {Router} = require("express");
const router = Router();
const Event = require("../model/Event");
const {EVENT, PUBLIC} = require("../permission/entity");
const {GET, POST, PUT, DELETE} = require("../permission/method");
const permissionCheck = require("../permission/check");
const {createGet, createGetById, createPost, createPut, createDelete} = require("./factory/routeFactory");

const eventQuery =  {
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
    permissionCheck([EVENT, PUBLIC], GET),
    createGet(Event, eventQuery),
);

router.get(
    "/:id/",
    permissionCheck([EVENT, PUBLIC], GET),
    createGetById(Event),
);

router.post(
    "/",
    permissionCheck([EVENT, PUBLIC], POST),
    createPost(Event),
);

router.put(
    "/:id/",
    permissionCheck([EVENT, PUBLIC], PUT),
    createPut(Event),
);

router.delete(
    "/:id/",
    permissionCheck([EVENT, PUBLIC], DELETE),
    createDelete(Event),
);

module.exports = router;
