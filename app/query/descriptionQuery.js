const filterList = {
    "field": {
        ...require("./filter/fieldFilter"),
    },
    "property": {
        ...require("./filter/propertyFilter"),
    },
    "flag": {
        ...require("./filter/flagFilter"),
    },
}

module.exports = {
    parseFilter: require("./queryParser")(filterList),
};
