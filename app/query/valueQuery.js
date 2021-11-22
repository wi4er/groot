const filterList = {
    "field_id": (result, list) => {
        result["_id"] = list;
    },
}

module.exports = {
    parseFilter: require("./queryParser")(filterList),
};
