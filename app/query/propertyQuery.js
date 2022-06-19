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
};

const sortList = {

};

module.exports = {
    parseFilter: require("./filter")(filterList),
    parseSort: require("./sort")(sortList),
};
