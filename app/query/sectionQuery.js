const WrongQueryArgument = require("../exception/WrongQueryArgument");

const filterList = {
    "field": {
        "id": {
            "in": (result, list) => result["_id"] = {$in: list},
        },
        "timestamp": {
            "gt": (result, list) => {
                if (!result["timestamp"]) {
                    result["timestamp"] = {};
                }

                result["timestamp"].$gte = list[0];
            },
            "lt": (result, list) => {
                if (!result["timestamp"]) {
                    result["timestamp"] = {};
                }

                result["timestamp"].$lte = list[0];
            },
        },
        "created": {
            "gt": (result, list) => {
                if (!result["created"]) {
                    result["created"] = {};
                }

                result["created"].$gte = list[0];
            },
            "lt": (result, list) => {
                if (!result["created"]) {
                    result["created"] = {};
                }

                result["created"].$lte = list[0];
            },
        },
    },
    "property": {
        "in": (result, list, propertySlug) => {
            result[`property.DEF.${propertySlug}`] = {$in: list};
        }
    },
    "flag": {
        "in": (result, list) => {
            result[`flag`] = {$in: list};
        },
        "and": (result, list) => {
            if (!result["$and"]) {
                result["$and"] = [];
            }

            for (const item of list) {
                result["$and"].push({flag: item})
            }
        },
    }
}

const sortList = {}

const filterFactory = list => (filter = []) => {
    const result = {};

    for (const item of filter) {
        for (const key in item) {
            for (const field in item[key]) {
                if (typeof list[key][field] === "function") {
                    if (Array.isArray(item[key][field])) {
                        list[key][field](result, item[key][field]);
                    } else {
                        list[key][field](result, item[key][field].split(";"));
                    }

                    continue;
                }

                for (const operation in item[key][field]) {
                    let params;

                    if (Array.isArray(item[key][field][operation])) {
                        params = item[key][field][operation];
                    } else {
                        params = item[key][field][operation].split(";");

                    }

                    if (typeof list[key][operation] === "function") {
                        list[key]?.[operation]?.(result, params, field);
                    } else if (typeof list[key]?.[field]?.[operation] === "function") {
                        list[key]?.[field]?.[operation]?.(result, params);
                    } else {
                        throw new WrongQueryArgument("Wrong query argument!");
                    }
                }
            }
        }
    }

    return result;
}


module.exports = {
    parseFilter: filterFactory(filterList),
    parseSort: require("./factory/sortFactory")(sortList),
};
