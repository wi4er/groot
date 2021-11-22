const filterList = {
    "field_id": (result, list) => {
        result["_id"] = list;
    },
    "field_slug": (result, list) => {
        result["slug"] = {$in: list};
    },
    "status": (result, list) => {
        result["status"] = {$in: list};
    },
}

module.exports = {
    parseFilter: require("./queryParser")(filterList),
};
