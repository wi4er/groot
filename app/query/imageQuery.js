const filterList = {
    "field_id": (result, list) => {
        result["_id"] = list;
    },
    "status": (result, list) => {
        result["status"] = list
    },
}

module.exports = {
    parseFilter: require("./queryParser")(filterList),
};
