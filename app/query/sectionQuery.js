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
    "value": {
        ...require("./filter/valueFilter"),
    },
}

const sortList = {}

module.exports = {
    parseFilter: require("./filter")(filterList),
    parseSort: require("./sort")(sortList),
};
